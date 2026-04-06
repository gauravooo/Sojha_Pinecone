interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async ({ params, env }) => {
  const id = params.id as string;
  if (!id) return new Response("Not found", { status: 404 });

  const result = await env.DB.prepare("SELECT data FROM images WHERE id = ?").bind(id).first();
  if (!result || !result.data) {
    return new Response("Not found", { status: 404 });
  }

  const dataStr = result.data as string;
  // expects data:image/webp;base64,....
  const base64Match = dataStr.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
  
  if (!base64Match) {
    return new Response("Invalid image format", { status: 500 });
  }

  const mimeType = base64Match[1];
  const b64Data = base64Match[2];
  
  const binaryString = atob(b64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return new Response(bytes, {
    headers: {
      "Content-Type": mimeType,
      "Cache-Control": "public, max-age=31536000, immutable", 
    }
  });
};
