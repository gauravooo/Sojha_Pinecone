export default function Explore() {
  const places = [
    { 
      title: "Jalori Pass", 
      desc: "Experience dramatic panoramic views of the Dhauladhar ranges from this stunning mountain pass just 5 km away.",
      image: "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&w=800&q=80",
      distance: "5 KM"
    },
    { 
      title: "Serolsar Lake", 
      desc: "A sacred high-altitude lake surrounded by dense oak forests, perfect for a day hike.",
      image: "https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=800&q=80",
      distance: "6 KM"
    },
    { 
      title: "Chehni Kothi", 
      desc: "Explore this towering 1500-year-old wooden architectural marvel nestled among apple orchards.",
      image: "https://images.unsplash.com/photo-1473625247510-8ceb1760943f?auto=format&fit=crop&w=800&q=80",
      distance: "8 KM"
    }
  ];

  return (
    <>
      <section id="explore" className="py-24 px-6 bg-brand-muted w-full overflow-hidden">
          <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                  <div className="max-w-xl">
                      <p className="text-xs font-semibold tracking-[0.2em] text-brand-accent uppercase mb-3">Exploration</p>
                      <h2 className="font-serif text-4xl md:text-5xl text-brand-dark mb-4">Places to Visit Nearby</h2>
                      <p className="text-gray-500 font-light leading-relaxed">
                          Sojha provides the perfect basecamp for discovering the pristine wilderness and hidden treasures of the Banjar eco-zone.
                      </p>
                  </div>
              </div>

              {/* Horizontal / Grid Layout for Places */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {places.map((place, i) => (
                    <div key={i} className="group cursor-pointer">
                        <div className="relative h-80 rounded-2xl overflow-hidden mb-6 shadow-sm group-hover:shadow-xl transition-shadow duration-500">
                            <img src={place.image} alt={place.title} className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 text-white text-xs font-medium tracking-wider">
                                {place.distance}
                            </div>
                        </div>
                        <h4 className="font-serif text-2xl text-brand-dark mb-3 group-hover:text-brand-accent transition-colors">{place.title}</h4>
                        <p className="text-sm text-gray-500 font-light leading-relaxed">{place.desc}</p>
                    </div>
                  ))}
              </div>
          </div>
      </section>

      <section className="py-20 px-6 bg-[#1A2421] text-white">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
              <div>
                  <p className="text-xs font-semibold tracking-[0.2em] text-white/50 uppercase mb-3">Journey</p>
                  <h2 className="font-serif text-4xl md:text-5xl mb-8 leading-tight">Your Path <br/>to Serenity</h2>
                  <p className="text-white/70 font-light leading-relaxed mb-10 max-w-md">
                      Whether you're flying above the clouds or navigating the winding roads, the journey to Sojha is part of the enchantment.
                  </p>
              </div>
              
              <div className="space-y-8 bg-white/5 border border-white/10 p-10 rounded-2xl backdrop-blur-sm">
                  <div className="flex gap-6 group">
                      <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-brand-accent/40 transition-colors">
                          <i className="fa-solid fa-plane text-xl text-white"></i>
                      </div>
                      <div>
                          <h4 className="font-medium text-xl text-white mb-2">Arrival By Air</h4>
                          <p className="text-sm text-white/60 font-light leading-relaxed">
                              Bhuntar Airport (Kullu) is the closest domestic airport, approximately 50 km (2.5 hours) from the retreat. We can arrange premium airport transfers upon request.
                          </p>
                      </div>
                  </div>
                  <div className="w-full h-px bg-white/10"></div>
                  <div className="flex gap-6 group">
                      <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-brand-accent/40 transition-colors">
                          <i className="fa-solid fa-car text-xl text-white"></i>
                      </div>
                      <div>
                          <h4 className="font-medium text-xl text-white mb-2">Arrival By Road</h4>
                          <p className="text-sm text-white/60 font-light leading-relaxed">
                              A profoundly scenic drive from Delhi (via NH3). Volvo buses run daily to Aut. From Aut, Sojha is a picturesque 1.5-hour taxi ride weaving through Banjar Valley.
                          </p>
                      </div>
                  </div>
              </div>
          </div>
      </section>
    </>
  );
}
