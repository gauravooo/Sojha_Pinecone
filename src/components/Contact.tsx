import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', checkin: '', checkout: '', message: ''
  });
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus({ type: 'success', message: 'Thank you! Your request has been sent successfully.' });
        setFormData({ name: '', email: '', phone: '', checkin: '', checkout: '', message: '' });
      } else {
        throw new Error('Failed to send');
      }
    } catch (error) {
      console.error("Backend Error:", error);
      setStatus({ type: 'error', message: 'Error sending message. Please try again later.' });
    }
  };

  return (
    <section id="contact" className="bg-brand-dark text-white py-24 px-6 relative">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
            
            <div className="flex flex-col h-full">
                <h2 className="font-serif text-4xl md:text-5xl mb-6">Get in Touch</h2>
                <p className="text-white/70 font-light mb-12 max-w-md">
                    We'd love to hear from you. Send us your inquiry and we'll respond within 24 hours to help plan your perfect mountain retreat.
                </p>
                
                <div className="space-y-6 mb-12">
                    <div className="flex items-start gap-4">
                        <i className="fa-solid fa-phone mt-1 text-brand-light/50"></i>
                        <div>
                            <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Phone</p>
                            <p className="font-light">+91 98765 43210</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <i className="fa-regular fa-envelope mt-1 text-brand-light/50"></i>
                        <div>
                            <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Email</p>
                            <p className="font-light">info@sojhapinecone.com</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <i className="fa-solid fa-location-dot mt-1 text-brand-light/50"></i>
                        <div>
                            <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Address</p>
                            <p className="font-light leading-relaxed">Sojha Village, Banjar Valley<br/>Himachal Pradesh, India</p>
                        </div>
                    </div>
                </div>

                <div className="w-full h-64 rounded-lg overflow-hidden mt-auto shadow-inner">
                    <iframe 
                        src="https://maps.google.com/maps?q=31.5385,77.3820&z=14&output=embed" 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen={false} 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade">
                    </iframe>
                </div>
            </div>

            <div>
                <form id="bookingForm" onSubmit={handleSubmit} className="space-y-8 bg-[#1a2e23] p-8 md:p-10 rounded-xl shadow-2xl">
                    <div className="grid grid-cols-1 gap-8">
                        <div>
                            <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">Your Name</label>
                            <input type="text" id="name" required className="form-input text-sm" value={formData.name} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">Email Address</label>
                            <input type="email" id="email" required className="form-input text-sm" value={formData.email} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">Phone Number</label>
                            <input type="tel" id="phone" required className="form-input text-sm" value={formData.phone} onChange={handleChange} />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">Check-in</label>
                            <input type="date" id="checkin" className="form-input text-sm" value={formData.checkin} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">Check-out</label>
                            <input type="date" id="checkout" className="form-input text-sm" value={formData.checkout} onChange={handleChange} />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">Your Message or Special Requests</label>
                        <textarea id="message" rows={3} required className="form-input text-sm resize-none" value={formData.message} onChange={handleChange}></textarea>
                    </div>

                    <button type="submit" disabled={status.type === 'loading'} className="w-full bg-brand-light text-brand-dark hover:bg-white py-4 rounded-sm transition font-medium text-sm tracking-wide mt-4 disabled:opacity-70">
                        {status.type === 'loading' ? (
                          <><i className="fa-solid fa-circle-notch fa-spin"></i> Sending...</>
                        ) : 'Submit Request'}
                    </button>
                    
                    {status.type !== 'idle' && status.type !== 'loading' && (
                        <div className={`text-sm font-light text-center mt-4 ${status.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                            {status.message}
                        </div>
                    )}
                </form>
            </div>
        </div>
    </section>
  );
}
