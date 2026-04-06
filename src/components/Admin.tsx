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

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem("adminToken") || "");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [contact, setContact] = useState({ phone: "", email: "", address: "" });
  const [images, setImages] = useState<any[]>([]);
  const [places, setPlaces] = useState<Place[]>(DEFAULT_PLACES);
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

      </div>
    </div>
  );
}
