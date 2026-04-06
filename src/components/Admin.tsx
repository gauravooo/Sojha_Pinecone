import React, { useState, useEffect } from 'react';
import imageCompression from 'browser-image-compression';

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem("adminToken") || "");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [contact, setContact] = useState({ phone: "", email: "", address: "" });
  const [images, setImages] = useState<any[]>([]);
  const [view, setView] = useState('contact'); // 'contact', 'gallery', 'rooms'
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (token) {
      // Auto login if we have a token (we'll just assume it's right, wrong token gets rejected on API call)
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
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
            onChange={e => setToken(e.target.value)} 
          />
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
        <h2 className="text-3xl font-serif text-brand-dark mb-8 tracking-wide capitalize">{view.replace('_', ' ')} Management</h2>
        
        {status && <div className="mb-6 p-4 bg-brand-accent/20 text-brand-dark rounded text-sm font-medium">{status}</div>}

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
