import { json, jsonHeaders } from "../_lib/http";
import {
  availabilityStatus,
  isEmergencyText,
  normalizeText,
  ServiceRequestPayload
} from "../_lib/requests";

interface Env {
  DB: D1Database;
  OPS_WEBHOOK_URL?: string;
}

function buildFeishuText(record: {
  id: string;
  name: string;
  contact: string;
  city: string;
  language: string;
  serviceDate: string;
  urgency: string;
  symptoms: string;
  notes: string;
  emergencyFlag: boolean;
  pagePath: string;
  referrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
}) {
  const lines = [
    "CareBridge new service request",
    `Request ID: ${record.id}`,
    `Name: ${record.name}`,
    `Contact: ${record.contact}`,
    `City: ${record.city}`,
    `Language: ${record.language}`,
    `Service date: ${record.serviceDate || "Not provided"}`,
    `Urgency: ${record.urgency}`,
    `Symptoms: ${record.symptoms}`,
    `Notes: ${record.notes || "None"}`,
    `Emergency flag: ${record.emergencyFlag ? "Yes" : "No"}`,
    `Page path: ${record.pagePath || "Unknown"}`,
    `Referrer: ${record.referrer || "Direct"}`,
    `UTM source: ${record.utmSource || "None"}`,
    `UTM medium: ${record.utmMedium || "None"}`,
    `UTM campaign: ${record.utmCampaign || "None"}`,
    `UTM term: ${record.utmTerm || "None"}`,
    `UTM content: ${record.utmContent || "None"}`
  ];

  return {
    msg_type: "text",
    content: {
      text: lines.join("\n")
    }
  };
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  let payload: ServiceRequestPayload;

  try {
    payload = await context.request.json<ServiceRequestPayload>();
  } catch {
    return json({ message: "Invalid request body." }, { status: 400 });
  }

  const requiredFields: Array<keyof ServiceRequestPayload> = [
    "name",
    "contact",
    "city",
    "symptoms",
    "urgency"
  ];

  const missingField = requiredFields.find((field) => !normalizeText(payload[field]));

  if (missingField) {
    return json({ message: `Missing required field: ${missingField}.` }, { status: 400 });
  }

  const symptoms = normalizeText(payload.symptoms);
  const city = normalizeText(payload.city);
  const language = normalizeText(payload.language) || "English";
  const serviceDate = normalizeText(payload.serviceDate);
  const notes = normalizeText(payload.notes);
  const emergencyFlag = isEmergencyText(symptoms);
  const availability = availabilityStatus({
    city,
    language,
    serviceDate
  });

  const record = {
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    name: normalizeText(payload.name),
    contact: normalizeText(payload.contact),
    contactType: normalizeText(payload.contactType) || "direct",
    city,
    language,
    serviceDate,
    urgency: normalizeText(payload.urgency),
    symptoms,
    notes,
    pagePath: normalizeText(payload.pagePath),
    referrer: normalizeText(payload.referrer),
    utmSource: normalizeText(payload.utmSource),
    utmMedium: normalizeText(payload.utmMedium),
    utmCampaign: normalizeText(payload.utmCampaign),
    utmTerm: normalizeText(payload.utmTerm),
    utmContent: normalizeText(payload.utmContent),
    status: "received",
    emergencyFlag
  };

  await context.env.DB.prepare(
    `INSERT INTO service_requests
      (id, name, contact, contact_type, city, language, service_date, urgency, symptoms, notes, page_path, referrer, utm_source, utm_medium, utm_campaign, utm_term, utm_content, status, emergency_flag, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      record.id,
      record.name,
      record.contact,
      record.contactType,
      record.city,
      record.language,
      record.serviceDate || null,
      record.urgency,
      record.symptoms,
      record.notes || null,
      record.pagePath || null,
      record.referrer || null,
      record.utmSource || null,
      record.utmMedium || null,
      record.utmCampaign || null,
      record.utmTerm || null,
      record.utmContent || null,
      record.status,
      record.emergencyFlag ? 1 : 0,
      record.submittedAt,
      record.submittedAt
    )
    .run();

  if (context.env.OPS_WEBHOOK_URL) {
    const webhookResponse = await fetch(context.env.OPS_WEBHOOK_URL, {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(buildFeishuText(record))
    });

    const webhookText = await webhookResponse.text();
    let webhookPayload: { code?: number; msg?: string; StatusCode?: number; StatusMessage?: string } | null =
      null;

    try {
      webhookPayload = JSON.parse(webhookText);
    } catch {
      webhookPayload = null;
    }

    const feishuAccepted =
      webhookResponse.ok &&
      (webhookPayload?.code === undefined || webhookPayload.code === 0) &&
      (webhookPayload?.StatusCode === undefined || webhookPayload.StatusCode === 0);

    if (!feishuAccepted) {
      console.error("Feishu webhook request failed", {
        status: webhookResponse.status,
        body: webhookText,
        requestId: record.id
      });
    } else {
      console.log("Feishu webhook sent", {
        requestId: record.id,
        body: webhookPayload ?? webhookText
      });
    }
  } else {
    console.warn("OPS_WEBHOOK_URL is not configured", { requestId: record.id });
  }

  if (record.emergencyFlag) {
    return json({
      requestId: record.id,
      status: record.status,
      message:
        "Request received. Your symptoms may need urgent attention, so please go to the nearest emergency department immediately while our team follows up."
    });
  }

  return json({
    requestId: record.id,
    status: availability.status === "limited" ? "under_review" : record.status,
    message:
      availability.status === "limited"
        ? "Your request has been received and will be reviewed with priority."
        : "Thanks — your request was received. Our team will contact you shortly."
  });
};
