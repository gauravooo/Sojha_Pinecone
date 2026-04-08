interface Env {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const body = await request.json() as {
      id: string;
      name: string;
      description: string;
      features: string[];
      original_price: number | null;
      current_price: number | null;
    };

    await env.DB.prepare(`
      INSERT INTO rooms (id, name, description, features, original_price, current_price)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        description = excluded.description,
        features = excluded.features,
        original_price = excluded.original_price,
        current_price = excluded.current_price
    `)
      .bind(
        body.id,
        body.name,
        body.description,
        JSON.stringify(body.features),
        body.original_price ?? null,
        body.current_price ?? null
      )
      .run();

    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) return Response.json({ error: 'Missing id' }, { status: 400 });

    await env.DB.prepare("DELETE FROM rooms WHERE id = ?").bind(id).run();
    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
};
