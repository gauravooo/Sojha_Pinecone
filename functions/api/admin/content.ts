interface Env {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const { key, value } = await request.json() as { key: string, value: any };
    await env.DB.prepare("INSERT INTO site_content (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value")
      .bind(key, JSON.stringify(value))
      .run();
    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
};
