import { useState, useContext } from 'react';
import { content } from '../data/content';
import { ContentContext } from '../App';

export default function Rooms() {
  const siteData = useContext(ContentContext);
  const dbImages = siteData?.roomImages?.filter((img: any) => img.category === 'room_deluxe').map((i: any) => i.url) || [];
  const roomImages = dbImages.length > 0 ? dbImages : [content.rooms.deluxe.image];
  
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevImage = () => {
    setCurrentIndex(prev => prev === 0 ? roomImages.length - 1 : prev - 1);
  };

  const nextImage = () => {
    setCurrentIndex(prev => prev === roomImages.length - 1 ? 0 : prev + 1);
  };

  return (
    <section id="rooms" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-2">Accommodation</p>
                <h2 className="font-serif text-4xl md:text-5xl text-brand-dark">Our Rooms</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="relative h-[400px] rounded-lg overflow-hidden shadow-md group">
                    {/* Carousel Images */}
                    <div 
                      className="flex transition-transform duration-500 ease-in-out h-full"
                      style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                      {roomImages.map((img: string, i: number) => (
                        <div key={i} className="min-w-full h-full">
                          <img src={img} alt={`Deluxe Room View ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                      ))}
                    </div>
                    
                    {/* Navigation Buttons */}
                    {roomImages.length > 1 && (
                      <>
                        <button 
                          onClick={prevImage} 
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow"
                        >
                          <i className="fa-solid fa-chevron-left"></i>
                        </button>
                        <button 
                          onClick={nextImage} 
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow"
                        >
                          <i className="fa-solid fa-chevron-right"></i>
                        </button>
                        
                        {/* Indicators */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {roomImages.map((_: any, i: number) => (
                            <div 
                              key={i} 
                              className={`w-2 h-2 rounded-full transition ${currentIndex === i ? 'bg-white' : 'bg-white/50'}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                </div>
                <div>
                    <h3 className="font-serif text-3xl text-brand-dark mb-4">Deluxe Mountain View</h3>
                    <p className="text-gray-600 font-light mb-8 leading-relaxed">
                        Our signature rooms offer breathtaking views of the Himalayan peaks. Wake up to misty mountains and fall asleep to the sound of rustling pines. Designed with warm wood accents and premium linens.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                        {content.rooms.deluxe.features.map((feature, i) => (
                          <p key={i}><i className="fa-regular fa-circle-check text-brand-accent mr-2"></i> {feature}</p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
}
