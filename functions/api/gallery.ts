export const onRequestGet: PagesFunction = async () => {
  const gallery_db = [
    {"id": 1, "url": "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", "alt": "Mountain View"},
    {"id": 2, "url": "https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", "alt": "Cozy Fireplace"},
    {"id": 3, "url": "https://images.unsplash.com/photo-1444124818704-4d89a495bbae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", "alt": "Valley Mist"},
    {"id": 4, "url": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", "alt": "Himalayan Peak"},
    {"id": 5, "url": "https://images.unsplash.com/photo-1473625247510-8ceb1760943f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", "alt": "Pine Forest"},
    {"id": 6, "url": "https://images.unsplash.com/photo-1520208422220-d12a3c588e6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", "alt": "Morning Coffee"}
  ];
  return Response.json({ images: gallery_db });
};
