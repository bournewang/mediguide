import { json } from "../_lib/http";

interface Env {
  DB: D1Database;
  ADMIN_API_KEY?: string;
}

type LeadRow = {
  id: string;
  name: string;
  contact: string;
  city: string;
  language: string;
  serviceDate: string | null;
  urgency: string;
  symptoms: string;
  status: string;
  emergencyFlag: number;
  pagePath: string | null;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  createdAt: string;
};

type CountRow = {
  label: string | null;
  count: number;
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const configuredKey = context.env.ADMIN_API_KEY;
  const providedKey = context.request.headers.get("x-admin-key") ?? "";

  if (!configuredKey) {
    return json({ message: "ADMIN_API_KEY is not configured." }, { status: 503 });
  }

  if (providedKey !== configuredKey) {
    return json({ message: "Unauthorized." }, { status: 401 });
  }

  const { searchParams } = new URL(context.request.url);
  const requestedLimit = Number.parseInt(searchParams.get("limit") ?? "50", 10);
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(requestedLimit, 1), 200)
    : 50;

  const recentLeads = await context.env.DB.prepare(
    `SELECT
        id,
        name,
        contact,
        city,
        language,
        service_date AS serviceDate,
        urgency,
        symptoms,
        status,
        emergency_flag AS emergencyFlag,
        page_path AS pagePath,
        referrer,
        utm_source AS utmSource,
        utm_medium AS utmMedium,
        utm_campaign AS utmCampaign,
        created_at AS createdAt
      FROM service_requests
      ORDER BY created_at DESC
      LIMIT ?`
  )
    .bind(limit)
    .all<LeadRow>();

  const leadsBySource = await context.env.DB.prepare(
    `SELECT COALESCE(NULLIF(utm_source, ''), 'direct') AS label, COUNT(*) AS count
      FROM service_requests
      GROUP BY COALESCE(NULLIF(utm_source, ''), 'direct')
      ORDER BY count DESC, label ASC`
  ).all<CountRow>();

  const leadsByPage = await context.env.DB.prepare(
    `SELECT COALESCE(NULLIF(page_path, ''), '(unknown)') AS label, COUNT(*) AS count
      FROM service_requests
      GROUP BY COALESCE(NULLIF(page_path, ''), '(unknown)')
      ORDER BY count DESC, label ASC`
  ).all<CountRow>();

  const leadsByCampaign = await context.env.DB.prepare(
    `SELECT COALESCE(NULLIF(utm_campaign, ''), '(none)') AS label, COUNT(*) AS count
      FROM service_requests
      GROUP BY COALESCE(NULLIF(utm_campaign, ''), '(none)')
      ORDER BY count DESC, label ASC`
  ).all<CountRow>();

  return json({
    success: true,
    recentLeads: recentLeads.results,
    summary: {
      totalLeads: recentLeads.results.length,
      bySource: leadsBySource.results,
      byPage: leadsByPage.results,
      byCampaign: leadsByCampaign.results
    }
  });
};
