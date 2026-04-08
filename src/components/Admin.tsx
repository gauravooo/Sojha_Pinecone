import React, { useState, useEffect } from 'react';
import imageCompression from 'browser-image-compression';

const DEFAULT_PLACES = [
  { 
    id: '1',
    title: "Jalori Pass", 
    desc: "Experience dramatic panoramic views of the Dhauladhar ranges from this stunning mountain pass just 5 km away.",
    image: "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&w=800&q=80",
    distance: "5 KM"
  },
  { 
    id: '2',
    title: "Serolsar Lake", 
    desc: "A sacred high-altitude lake surrounded by dense oak forests, perfect for a day hike.",
    image: "https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=800&q=80",
    distance: "6 KM"
  },
  { 
    id: '3',
    title: "Chehni Kothi", 
    desc: "Explore this towering 1500-year-old wooden architectural marvel nestled among apple orchards.",
    image: "https://images.unsplash.com/photo-1473625247510-8ceb1760943f?auto=format&fit=crop&w=800&q=80",
    distance: "8 KM"
  }
];

interface Place {
  id: string;
  title: string;
  desc: string;
  image: string;
  distance: string;
}

interface Room {
  id: string;
  name: string;
  description: string;
  features: string[];
  original_price: number | null;
  current_price: number | null;
}

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem("adminToken") || "");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [contact, setContact] = useState({ phone: "", email: "", address: "" });
  const [images, setImages] = useState<any[]>([]);
  const [places, setPlaces] = useState<Place[]>(DEFAULT_PLACES);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [view, setView] = useState('contact');
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && token) {
      localStorage.setItem("adminToken", token);
      fetchData();
    }
  }, [isLoggedIn, token]);

  const fetchData = async () => {
    try {
      const timestamp = Date.now();
      const res = await fetch(`/api/content?t=${timestamp}`);
      const data = await res.json();
      if (data.contact) setContact(data.contact);
      if (data.explorePlaces) setPlaces(data.explorePlaces);

      const resGallery = await fetch(`/api/gallery?t=${timestamp}`);
      const dataGallery = await resGallery.json();
      setImages([...(data.roomImages || []), ...(dataGallery.images || [])]);

      const resRooms = await fetch(`/api/rooms?t=${timestamp}`);
      const dataRooms = await resRooms.json();
      if (dataRooms.rooms) setRooms(dataRooms.rooms);
    } catch (err) {
      console.error(err);
      if ((err as Error).message.includes("401")) logout();
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setToken("");
    setIsLoggedIn(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: '__ping__', value: null })
      });
      if (res.status === 401) {
        setLoginError("Incorrect password. Please try again.");
        return;
      }
      setIsLoggedIn(true);
    } catch {
      setLoginError("Network error. Please try again.");
    }
  };

  const saveContact = async () => {
    setStatus("Saving...");
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'contact', value: contact })
      });
      if (res.ok) setStatus("Saved contact info!");
      else if (res.status === 401) return logout();
      else setStatus("Error saving.");
    } catch {
      setStatus("Network error.");
    }
  };

  const savePlaces = async () => {
    setStatus("Saving...");
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'explore_places', value: places })
      });
      if (res.ok) setStatus("Saved explore places!");
      else if (res.status === 401) return logout();
      else setStatus("Error saving.");
    } catch {
      setStatus("Network error.");
    }
  };

  // ── Room helpers ──
  const addRoom = () => {
    const newId = 'room_' + Date.now();
    setRooms(prev => [...prev, { id: newId, name: '', description: '', features: [], original_price: null, current_price: null }]);
  };

  const updateRoom = (id: string, field: keyof Room, value: any) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };


  const addFeature = (roomId: string, feature: string) => {
    if (!feature.trim()) return;
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, features: [...r.features, feature.trim()] } : r));
  };

  const removeFeature = (roomId: string, index: number) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, features: r.features.filter((_, i) => i !== index) } : r));
  };

  const saveRoom = async (room: Room) => {
    setStatus('Saving room...');
    try {
      const res = await fetch('/api/admin/rooms', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(room)
      });
      if (res.ok) setStatus('Room saved!');
      else if (res.status === 401) return logout();
      else setStatus('Error saving room.');
    } catch {
      setStatus('Network error.');
    }
  };

  const deleteRoom = async (id: string) => {
    if (!window.confirm('Delete this room?')) return;
    setStatus('Deleting...');
    try {
      const res = await fetch(`/api/admin/rooms?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) { setRooms(prev => prev.filter(r => r.id !== id)); setStatus('Room deleted.'); }
      else if (res.status === 401) logout();
    } catch {
      setStatus('Network error.');
    }
  };

  const updatePlace = (id: string, field: keyof Place, value: string) => {
    setPlaces(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const addPlace = () => {
    const newId = Date.now().toString();
    setPlaces(prev => [...prev, { id: newId, title: '', desc: '', image: '', distance: '' }]);
  };

  const removePlace = (id: string) => {
    if (!window.confirm("Remove this place?")) return;
    setPlaces(prev => prev.filter(p => p.id !== id));
  };

  const uploadPlaceImage = async (e: React.ChangeEvent<HTMLInputElement>, placeId: string) => {
    if (!e.target.files?.length) return;
    setStatus("Compressing image...");
    const file = e.target.files[0];
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.15,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
        fileType: 'image/webp'
      });
      const base64 = await imageCompression.getDataUrlFromFile(compressed);
      updatePlace(placeId, 'image', base64);
      setStatus("Image ready — click Save to persist.");
    } catch {
      setStatus("Image compression failed.");
    }
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>, category: string) => {
    if (!e.target.files?.length) return;
    setStatus("Compressing and uploading...");
    const file = e.target.files[0];

    const options = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/webp'
    };

    try {
      const compressedFile = await imageCompression(file, options);
      const base64 = await imageCompression.getDataUrlFromFile(compressedFile);
      const id = Date.now().toString() + '_' + Math.random().toString(36).substring(7);

      const res = await fetch('/api/admin/images', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, category, data: base64 })
      });
      
      if (res.ok) {
        setStatus("Image uploaded!");
        fetchData();
      } else if (res.status === 401) {
        logout();
      } else {
        setStatus("Error uploading image.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Error during compression/upload.");
    }
  };

  const deleteImage = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    setStatus("Deleting...");
    try {
      const res = await fetch(`/api/admin/images?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setStatus("Deleted!");
        fetchData();
      } else if (res.status === 401) {
        logout();
      }
    } catch {
      setStatus("Error deleting.");
    }
  };

  const inputClass = "w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent";

  if (!isLoggedIn) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
          <h2 className="text-2xl font-serif mb-6 text-center text-brand-dark">Admin Login</h2>
          <input 
            type="password" 
            placeholder="Password" 
            className={`${inputClass} mb-4`}
            value={token} 
            onChange={e => { setToken(e.target.value); setLoginError(""); }} 
          />
          {loginError && (
            <p className="text-red-500 text-sm mb-4">{loginError}</p>
          )}
          <button type="submit" className="w-full bg-brand-dark text-white py-2 rounded">Login</button>
        </form>
      </div>
    );
  }

  const ImageGrid = ({ category }: { category: string }) => {
    const subset = images.filter(img => img.category === category || (category === 'gallery' && !img.category));
    return (
      <div>
        <div className="mb-6">
          <label className="bg-brand-dark text-white px-4 py-2 rounded cursor-pointer">
            Upload Image
            <input type="file" accept="image/*" className="hidden" onChange={e => uploadImage(e, category)} />
          </label>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {subset.map(img => (
            <div key={img.id} className="relative group">
              <img src={img.url} className="w-full h-32 object-cover rounded shadow-sm border border-gray-100" />
              <button 
                onClick={() => deleteImage(img.id)}
                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-brand-dark text-white p-6 flex flex-col h-screen sticky top-0">
        <h1 className="text-2xl font-serif mb-8">Admin</h1>
        <ul className="space-y-4 flex-1">
          <li><button onClick={() => setView('contact')} className={view === 'contact' ? 'text-brand-light' : 'opacity-70 hover:opacity-100'}>Contact Info</button></li>
          <li><button onClick={() => setView('explore')} className={view === 'explore' ? 'text-brand-light' : 'opacity-70 hover:opacity-100'}>Explore Places</button></li>
          <li><button onClick={() => setView('rooms_content')} className={view === 'rooms_content' ? 'text-brand-light' : 'opacity-70 hover:opacity-100'}>Rooms &amp; Pricing</button></li>
          <li><button onClick={() => setView('site_images')} className={view === 'site_images' ? 'text-brand-light' : 'opacity-70 hover:opacity-100'}>Site Images</button></li>
          <li><button onClick={() => setView('gallery')} className={view === 'gallery' ? 'text-brand-light' : 'opacity-70 hover:opacity-100'}>Gallery Images</button></li>
          <li><button onClick={() => setView('rooms')} className={view === 'rooms' ? 'text-brand-light' : 'opacity-70 hover:opacity-100'}>Room Images</button></li>
        </ul>
        <div className="space-y-4 border-t border-white/20 pt-4 mt-auto">
          <button onClick={() => window.location.href = '/'} className="opacity-70 hover:opacity-100 block w-full text-left">Back to Site</button>
          <button onClick={logout} className="opacity-70 hover:opacity-100 text-red-300 block w-full text-left">Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto">
        <h2 className="text-3xl font-serif text-brand-dark mb-8 tracking-wide capitalize">
          {view.replace(/_/g, ' ')} Management
        </h2>
        
        {status && <div className="mb-6 p-4 bg-brand-accent/20 text-brand-dark rounded text-sm font-medium">{status}</div>}

        {/* ── Contact ── */}
        {view === 'contact' && (
          <div className="bg-white p-6 rounded-lg shadow-sm max-w-2xl space-y-6">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Phone</label>
              <input type="text" className={inputClass} value={contact.phone} onChange={e => setContact({...contact, phone: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input type="email" className={inputClass} value={contact.email} onChange={e => setContact({...contact, email: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Address</label>
              <textarea className={inputClass} rows={3} value={contact.address} onChange={e => setContact({...contact, address: e.target.value})} />
            </div>
            <button onClick={saveContact} className="bg-brand-dark hover:bg-black text-white px-6 py-2 rounded transition shadow-sm">Save Contact Info</button>
          </div>
        )}

        {/* ── Explore Places ── */}
        {view === 'explore' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Edit the places shown in the Explore section. Each place has an image, name, description, and distance.</p>
              <button
                onClick={addPlace}
                className="bg-brand-dark text-white px-4 py-2 rounded text-sm hover:bg-black transition flex items-center gap-2"
              >
                <i className="fa-solid fa-plus"></i> Add Place
              </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 w-24">Image</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 w-40">Name</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Description</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 w-28">Distance</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 w-20">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {places.map((place) => (
                    <tr key={place.id} className="hover:bg-gray-50 transition-colors align-top">
                      {/* Image cell */}
                      <td className="px-4 py-3">
                        <div className="relative group w-20 h-16 rounded overflow-hidden bg-gray-100 border border-gray-200">
                          {place.image ? (
                            <img src={place.image} alt={place.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                              <i className="fa-solid fa-image text-xl"></i>
                            </div>
                          )}
                          <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer">
                            <i className="fa-solid fa-camera text-white text-sm"></i>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={e => uploadPlaceImage(e, place.id)}
                            />
                          </label>
                        </div>
                        <div className="mt-1">
                          <input
                            type="text"
                            placeholder="Or paste URL"
                            className="w-20 text-xs border border-gray-200 rounded px-1 py-0.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-accent/50"
                            value={place.image.startsWith('data:') ? '' : place.image}
                            onChange={e => updatePlace(place.id, 'image', e.target.value)}
                          />
                        </div>
                      </td>

                      {/* Name */}
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          className={inputClass}
                          placeholder="Place name"
                          value={place.title}
                          onChange={e => updatePlace(place.id, 'title', e.target.value)}
                        />
                      </td>

                      {/* Description */}
                      <td className="px-4 py-3">
                        <textarea
                          className={`${inputClass} resize-none`}
                          rows={3}
                          placeholder="Short description..."
                          value={place.desc}
                          onChange={e => updatePlace(place.id, 'desc', e.target.value)}
                        />
                      </td>

                      {/* Distance */}
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          className={inputClass}
                          placeholder="e.g. 5 KM"
                          value={place.distance}
                          onChange={e => updatePlace(place.id, 'distance', e.target.value)}
                        />
                      </td>

                      {/* Delete */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => removePlace(place.id)}
                          className="text-red-500 hover:text-red-700 transition"
                          title="Remove place"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={savePlaces}
              className="bg-brand-dark hover:bg-black text-white px-6 py-2 rounded transition shadow-sm"
            >
              Save Explore Places
            </button>
          </div>
        )}

        {/* ── Site Images ── */}
        {view === 'site_images' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl mb-4 font-serif text-gray-800">Hero Background</h3>
              <p className="text-sm text-gray-600 mb-4">Note: Uploading a new image will replace the existing one.</p>
              <ImageGrid category="hero" />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl mb-4 font-serif text-gray-800">About Section Image</h3>
              <p className="text-sm text-gray-600 mb-4">Note: Uploading a new image will replace the existing one.</p>
              <ImageGrid category="about" />
            </div>
          </div>
        )}

        {view === 'gallery' && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl mb-4 font-serif text-gray-800">Gallery Details</h3>
            <ImageGrid category="gallery" />
          </div>
        )}

        {view === 'rooms' && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl mb-4 font-serif text-gray-800">Deluxe Room Slider Images</h3>
            <ImageGrid category="room_deluxe" />
          </div>
        )}

        {/* ── Rooms & Pricing ── */}
        {view === 'rooms_content' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Manage room details and pricing. Original price is optional — leave blank to show only the current price.</p>
              <button
                onClick={addRoom}
                className="bg-brand-dark text-white px-4 py-2 rounded text-sm hover:bg-black transition flex items-center gap-2"
              >
                <i className="fa-solid fa-plus"></i> Add Room Type
              </button>
            </div>

            {rooms.map(room => {
              const hasDiscount = room.original_price && room.current_price && room.original_price > room.current_price;
              const discountPct = hasDiscount ? Math.round((1 - room.current_price! / room.original_price!) * 100) : 0;

              return (
                <div key={room.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl text-brand-dark">{room.name || 'New Room'}</h3>
                    <button onClick={() => deleteRoom(room.id)} className="text-red-400 hover:text-red-600 transition text-sm"><i className="fa-solid fa-trash mr-1"></i>Delete</button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Room Name</label>
                      <input type="text" className={inputClass} value={room.name} onChange={e => updateRoom(room.id, 'name', e.target.value)} placeholder="e.g. Deluxe Mountain View" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-600 mb-1">Description</label>
                      <textarea className={inputClass} rows={3} value={room.description} onChange={e => updateRoom(room.id, 'description', e.target.value)} placeholder="Room description..." />
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Features</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {room.features.map((f, i) => (
                        <span key={i} className="flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full">
                          {f}
                          <button onClick={() => removeFeature(room.id, i)} className="text-gray-400 hover:text-red-500 transition">
                            <i className="fa-solid fa-xmark text-[10px]"></i>
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className={`${inputClass} text-sm`}
                        placeholder="Add a feature, press Enter"
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            addFeature(room.id, (e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="grid md:grid-cols-3 gap-4 items-end">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Original Price (₹) <span className="text-gray-400 font-normal">optional</span></label>
                      <input
                        type="number"
                        className={inputClass}
                        placeholder="e.g. 5000"
                        value={room.original_price ?? ''}
                        onChange={e => updateRoom(room.id, 'original_price', e.target.value ? Number(e.target.value) : null)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Current Price (₹)</label>
                      <input
                        type="number"
                        className={inputClass}
                        placeholder="e.g. 3500"
                        value={room.current_price ?? ''}
                        onChange={e => updateRoom(room.id, 'current_price', e.target.value ? Number(e.target.value) : null)}
                      />
                    </div>
                    <div>
                      {hasDiscount ? (
                        <div className="flex items-center gap-2 pb-2">
                          <span className="bg-emerald-100 text-emerald-700 text-sm font-semibold px-3 py-1.5 rounded-full">{discountPct}% OFF</span>
                          <span className="text-gray-400 text-sm line-through">₹{room.original_price!.toLocaleString('en-IN')}</span>
                          <span className="text-brand-dark font-semibold">₹{room.current_price!.toLocaleString('en-IN')}</span>
                        </div>
                      ) : room.current_price ? (
                        <div className="pb-2 text-brand-dark font-semibold">₹{room.current_price.toLocaleString('en-IN')}/night</div>
                      ) : <div className="pb-2 text-gray-400 text-sm">No price set</div>}
                    </div>
                  </div>

                  <button
                    onClick={() => saveRoom(room)}
                    className="bg-brand-dark hover:bg-black text-white px-6 py-2 rounded transition shadow-sm text-sm"
                  >
                    Save Room
                  </button>
                </div>
              );
            })}

            {rooms.length === 0 && (
              <div className="bg-white p-12 rounded-lg text-center text-gray-400">No rooms yet. Click "Add Room Type" to get started.</div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
