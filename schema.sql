CREATE TABLE IF NOT EXISTS site_content (
  key TEXT PRIMARY KEY,
  value TEXT
);

CREATE TABLE IF NOT EXISTS images (
  id TEXT PRIMARY KEY,
  category TEXT,
  data TEXT,
  added_at INTEGER
);

-- Seed initial data
INSERT OR IGNORE INTO site_content (key, value) VALUES (
  'contact', 
  '{"phone":"+91 98765 43210","email":"info@sojhapinecone.com","address":"Sojha Village, Banjar Valley\\nHimachal Pradesh, India"}'
);
