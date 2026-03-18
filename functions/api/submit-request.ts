interface Env {
  REQUESTS?: KVNamespace;
  OPS_WEBHOOK_URL?: string;
}

interface RequestPayload {
  name?: string;
  contact?: string;
  city?: string;
  language?: string;
  symptoms?: string;
  urgency?: string;
  serviceDate?: string;
}

const jsonHeaders = {
  "content-type": "application/json; charset=utf-8"
};

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      ...jsonHeaders,
      ...init.headers
    }
  });
}

function isEmergencyText(symptoms: string) {
  return /(chest pain|trouble breathing|can't breathe|heavy bleeding|unconscious|stroke|seizure)/i.test(
    symptoms
  );
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  let payload: RequestPayload;

  try {
    payload = await context.request.json<RequestPayload>();
  } catch {
    return json({ message: "Invalid request body." }, { status: 400 });
  }

  const requiredFields: Array<keyof RequestPayload> = [
    "name",
    "contact",
    "city",
    "symptoms",
    "urgency"
  ];

  const missingField = requiredFields.find((field) => !payload[field]?.trim());

  if (missingField) {
    return json({ message: `Missing required field: ${missingField}.` }, { status: 400 });
  }

  const record = {
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    ...payload,
    emergencyFlag: isEmergencyText(payload.symptoms || "")
  };

  if (context.env.REQUESTS) {
    await context.env.REQUESTS.put(`request:${record.id}`, JSON.stringify(record));
  }

  if (context.env.OPS_WEBHOOK_URL) {
    await fetch(context.env.OPS_WEBHOOK_URL, {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(record)
    });
  }

  if (record.emergencyFlag) {
    return json({
      message:
        "Request received. Your symptoms may need urgent attention, so please go to the nearest emergency department immediately while our team follows up."
    });
  }

  return json({
    message: "Thanks — your request was received. Our team will contact you shortly."
  });
};
