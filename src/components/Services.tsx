export default function Services() {
  const services = [
    { icon: "fa-bed", title: "Premium Accommodation", desc: "Wake up to stunning Himalayan views from the comfort of plush, curated bedding." },
    { icon: "fa-utensils", title: "Authentic Dining", desc: "Savor traditional Himachali culinary experiences crafted with the freshest local ingredients." },
    { icon: "fa-wifi", title: "Seamless Connectivity", desc: "Complimentary high-speed Wi-Fi keeping you flawlessly connected amidst nature." },
    { icon: "fa-person-hiking", title: "Curated Trails", desc: "Expert-guided trekking expeditions exploring hidden valleys and ancient forests." },
    { icon: "fa-fire", title: "Evening Bonfires", desc: "Gather under the starlit sky for soulful music and warmth on cool mountain nights." },
    { icon: "fa-car", title: "Secure Parking", desc: "Complimentary onsite parking providing complete peace of mind during your stay." }
  ];

  return (
    <section className="py-24 px-6 bg-brand-muted w-full">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-2xl mx-auto">
            <p className="text-xs font-semibold tracking-[0.2em] text-brand-accent uppercase mb-3">Our Offerings</p>
            <h2 className="font-serif text-4xl md:text-5xl text-brand-dark mb-6">Uncompromising Comfort</h2>
            <p className="text-gray-500 font-light leading-relaxed">
                Elevating your mountain retreat with thoughtful amenities and dedicated service, ensuring every moment is memorable.
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((svc, i) => (
              <div key={i} className="group relative bg-white overflow-hidden p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 transform hover:-translate-y-2 border border-gray-100/50 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-brand-light group-hover:bg-brand-accent/10 rounded-full flex items-center justify-center mb-6 transition-colors duration-500">
                    <i className={`fa-solid ${svc.icon} text-2xl text-brand-accent group-hover:scale-110 transition-transform duration-500`}></i>
                  </div>
                  <h4 className="font-serif text-xl text-brand-dark mb-3 tracking-wide">{svc.title}</h4>
                  <p className="text-sm text-gray-500 font-light leading-relaxed">{svc.desc}</p>
                  
                  {/* Subtle decorative accent */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-brand-accent group-hover:w-1/2 transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
