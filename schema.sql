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

CREATE TABLE IF NOT EXISTS rooms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  features TEXT,
  original_price INTEGER,
  current_price INTEGER,
  added_at INTEGER DEFAULT (unixepoch())
);

-- Seed initial data
INSERT OR IGNORE INTO site_content (key, value) VALUES (
  'contact', 
  '{"phone":"+91 98765 43210","email":"info@sojhapinecone.com","address":"Sojha Village, Banjar Valley\\nHimachal Pradesh, India"}'
);

INSERT OR IGNORE INTO site_content (key, value) VALUES (
  'explore_places',
  '[{"id":"1","title":"Jalori Pass","desc":"Experience dramatic panoramic views of the Dhauladhar ranges from this stunning mountain pass just 5 km away.","image":"https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&w=800&q=80","distance":"5 KM"},{"id":"2","title":"Serolsar Lake","desc":"A sacred high-altitude lake surrounded by dense oak forests, perfect for a day hike.","image":"https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=800&q=80","distance":"6 KM"},{"id":"3","title":"Chehni Kothi","desc":"Explore this towering 1500-year-old wooden architectural marvel nestled among apple orchards.","image":"https://images.unsplash.com/photo-1473625247510-8ceb1760943f?auto=format&fit=crop&w=800&q=80","distance":"8 KM"}]'
);

-- Seed current room data
INSERT OR IGNORE INTO rooms (id, name, description, features, original_price, current_price) VALUES (
  'room_deluxe',
  'Deluxe Mountain View',
  'Our signature rooms offer breathtaking views of the Himalayan peaks. Wake up to misty mountains and fall asleep to the sound of rustling pines. Designed with warm wood accents and premium linens.',
  '["King-size bed","Private balcony","Mountain view","Attached bathroom","Room heater","24/7 hot water"]',
  NULL,
  NULL
);
