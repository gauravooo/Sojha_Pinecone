export const onRequestGet: PagesFunction = async () => {
  const gallery_db = [
    {"id": 1, "url": "https://images.unsplash.com/photo-1546944641-55db293b6667?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", "alt": "Mountain Mist"},
    {"id": 2, "url": "https://images.unsplash.com/photo-1627885435985-78096f2e82b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", "alt": "Forest Trail"},
    {"id": 3, "url": "https://images.unsplash.com/photo-1588615419958-37daebfc7e0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", "alt": "Cozy Interior"},
    {"id": 4, "url": "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", "alt": "Valley View"}
  ];
  return Response.json({ images: gallery_db });
};
