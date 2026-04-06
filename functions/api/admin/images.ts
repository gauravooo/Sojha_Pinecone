interface Env {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const { id, category, data } = await request.json() as { id: string, category: string, data: string };
    await env.DB.prepare("INSERT INTO images (id, category, data, added_at) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET data=excluded.data, category=excluded.category")
      .bind(id, category, data, Date.now())
      .run();
    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) return Response.json({ error: "No ID provided" }, { status: 400 });
    
    await env.DB.prepare("DELETE FROM images WHERE id = ?").bind(id).run();
    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
};
