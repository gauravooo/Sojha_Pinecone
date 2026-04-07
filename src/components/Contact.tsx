import { useState, useContext } from 'react';
import { ContentContext } from '../App';

export default function Contact() {
  const siteData = useContext(ContentContext);
  const contactInfo = siteData?.contact || {
    phone: "+91 98765 43210",
    email: "info@sojhapinecone.com",
    address: "Sojha Village, Banjar Valley\nHimachal Pradesh, India"
  };

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
  const handleWhatsApp = () => {
    // Strip non-digits and build wa.me link using the hotel phone from context
    const rawPhone = contactInfo.phone.replace(/\D/g, '');
    // Ensure country code is present (default +91 if not)
    const phone = rawPhone.startsWith('91') ? rawPhone : `91${rawPhone}`;

    const checkinText = formData.checkin ? `Check-in: ${formData.checkin}` : '';
    const checkoutText = formData.checkout ? `Check-out: ${formData.checkout}` : '';
    const datesText = [checkinText, checkoutText].filter(Boolean).join(', ');

    const message = [
      `Hi! I would like to enquire about a booking at Sojha Pinecone.`,
      formData.name ? `Name: ${formData.name}` : '',
      datesText,
      formData.message ? `Message: ${formData.message}` : ''
    ].filter(Boolean).join('\n');

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
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
                            <p className="font-light">{contactInfo.phone}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <i className="fa-regular fa-envelope mt-1 text-brand-light/50"></i>
                        <div>
                            <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Email</p>
                            <p className="font-light">{contactInfo.email}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <i className="fa-solid fa-location-dot mt-1 text-brand-light/50"></i>
                        <div>
                            <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Address</p>
                            <p className="font-light leading-relaxed whitespace-pre-wrap">{contactInfo.address}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <i className="fa-brands fa-instagram mt-1 text-brand-light/50 text-lg"></i>
                        <div>
                            <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Instagram</p>
                            <a
                                href="https://www.instagram.com/sojha_pinecone"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-light hover:text-brand-light transition-colors duration-200 flex items-center gap-1 group"
                            >
                                @sojhapinecone
                                <i className="fa-solid fa-arrow-up-right-from-square text-xs opacity-0 group-hover:opacity-100 transition-opacity"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="w-full h-64 rounded-lg overflow-hidden mt-auto shadow-inner">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3399.394729731334!2d77.3704211!3d31.568221700000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3905af3473c8f403%3A0x38f81b85c63511c9!2sShoja%20Pinecone!5e0!3m2!1sen!2sin!4v1775573823878!5m2!1sen!2sin" 
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <button
                        type="submit"
                        disabled={status.type === 'loading'}
                        className="w-full bg-brand-light text-brand-dark hover:bg-white py-4 rounded-sm transition font-medium text-sm tracking-wide disabled:opacity-70 flex items-center justify-center gap-2"
                      >
                        {status.type === 'loading' ? (
                          <><i className="fa-solid fa-circle-notch fa-spin"></i> Sending...</>
                        ) : (
                          <><i className="fa-regular fa-envelope"></i> Contact via Email</>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleWhatsApp}
                        className="w-full bg-[#25D366] text-white hover:bg-[#1ebe5d] py-4 rounded-sm transition font-medium text-sm tracking-wide flex items-center justify-center gap-2"
                      >
                        <i className="fa-brands fa-whatsapp text-lg"></i> Contact on WhatsApp
                      </button>
                    </div>
                    
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
