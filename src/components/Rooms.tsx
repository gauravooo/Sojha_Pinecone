import { content } from '../data/content';

export default function Rooms() {
  return (
    <section id="rooms" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-2">Accommodation</p>
                <h2 className="font-serif text-4xl md:text-5xl text-brand-dark">Our Rooms</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="h-[400px] rounded-lg overflow-hidden shadow-md">
                    <img src={content.rooms.deluxe.image} alt="Deluxe Room" className="w-full h-full object-cover hover:scale-105 transition duration-700" loading="lazy" />
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
