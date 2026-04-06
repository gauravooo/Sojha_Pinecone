interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const { results } = await env.DB.prepare(
    "SELECT id, '/api/image/' || id as url, 'Gallery Image' as alt FROM images WHERE category = 'gallery' ORDER BY added_at DESC"
  ).all();
  return Response.json({ images: results }, {
    headers: {
      "Cache-Control": "public, max-age=60"
    }
  });
};
