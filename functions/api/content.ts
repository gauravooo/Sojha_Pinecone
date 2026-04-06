interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const contactResult = await env.DB.prepare("SELECT value FROM site_content WHERE key = 'contact'").first();
  const contact = contactResult ? JSON.parse(contactResult.value as string) : null;
  
  const { results } = await env.DB.prepare(
    "SELECT id, category, '/api/image/' || id as url FROM images WHERE category LIKE 'room_%' OR category IN ('hero', 'about') ORDER BY added_at ASC"
  ).all();
  
  return Response.json({ 
    contact,
    siteImages: results.filter((img: any) => img.category === 'hero' || img.category === 'about'),
    roomImages: results.filter((img: any) => img.category.startsWith('room_'))
  }, {
    headers: {
      "Cache-Control": "public, max-age=60"
    }
  });
};
