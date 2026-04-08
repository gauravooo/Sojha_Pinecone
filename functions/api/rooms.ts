interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const { results } = await env.DB.prepare(
    "SELECT id, name, description, features, original_price, current_price FROM rooms ORDER BY added_at ASC"
  ).all();

  const rooms = results.map((row: any) => ({
    ...row,
    features: row.features ? JSON.parse(row.features) : [],
  }));

  return Response.json({ rooms }, {
    headers: {
      // Always fresh — prices must never be stale
      "Cache-Control": "no-store"
    }
  });
};
