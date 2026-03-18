interface Env {
  CONTACTS?: KVNamespace;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const payload = await context.request.json<Record<string, string>>();

  if (!payload.name || !payload.message || !payload.contact) {
    return new Response(JSON.stringify({ message: "Missing required contact fields." }), {
      status: 400,
      headers: {
        "content-type": "application/json; charset=utf-8"
      }
    });
  }

  if (context.env.CONTACTS) {
    await context.env.CONTACTS.put(
      `contact:${crypto.randomUUID()}`,
      JSON.stringify({
        ...payload,
        submittedAt: new Date().toISOString()
      })
    );
  }

  return new Response(JSON.stringify({ message: "Message received." }), {
    headers: {
      "content-type": "application/json; charset=utf-8"
    }
  });
};
