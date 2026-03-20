import { json } from "../_lib/http";
import { availabilityStatus, normalizeText, supportedCities, supportedLanguages } from "../_lib/requests";

interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { searchParams } = new URL(context.request.url);
  const city = normalizeText(searchParams.get("city") ?? "");
  const language = normalizeText(searchParams.get("language") ?? "");
  const serviceDate = normalizeText(searchParams.get("date") ?? "");

  if (!city || !language) {
    return json({ message: "Missing city or language." }, { status: 400 });
  }

  const coverage = await context.env.DB.prepare(
    `SELECT city, language, active, notes
     FROM service_coverage
     WHERE city = ? AND language = ?
     LIMIT 1`
  )
    .bind(city, language)
    .first<{ city: string; language: string; active: number; notes: string | null }>();

  const status = coverage?.active
    ? availabilityStatus({ city, language, serviceDate })
    : {
        status: "manual_review",
        message: "Service requires manual confirmation for the selected city or language."
      };

  return json({
    success: true,
    city,
    language,
    supportedCities,
    supportedLanguages,
    status: status.status,
    notes: coverage?.notes ?? null,
    message: status.message
  });
};
