export const jsonHeaders = {
  "content-type": "application/json; charset=utf-8"
};

export function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      ...jsonHeaders,
      ...init.headers
    }
  });
}
