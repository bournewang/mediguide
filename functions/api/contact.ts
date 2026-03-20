import { json } from "../_lib/http";

interface Env {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  let payload: Record<string, string>;

  try {
    payload = await context.request.json<Record<string, string>>();
  } catch {
    return json({ message: "Invalid request body." }, { status: 400 });
  }

  if (!payload.name || !payload.message || !payload.contact) {
    return json({ message: "Missing required contact fields." }, { status: 400 });
  }

  await context.env.DB.prepare(
    `INSERT INTO contact_messages (id, name, contact, message, created_at)
     VALUES (?, ?, ?, ?, ?)`
  )
    .bind(
      crypto.randomUUID(),
      payload.name.trim(),
      payload.contact.trim(),
      payload.message.trim(),
      new Date().toISOString()
    )
    .run();

  return json({ success: true, message: "Message received." });
};
