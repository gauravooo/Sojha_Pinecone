interface Env {
  ADMIN_PASSWORD?: string;
}

export const onRequest: PagesFunction<Env> = async ({ request, env, next }) => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
      }
    });
  }

  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");

  const expectedPassword = env.ADMIN_PASSWORD || "myadmin123";

  if (!token || token !== expectedPassword) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { 
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  return await next();
};
