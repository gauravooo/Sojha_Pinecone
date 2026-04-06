import { useContext } from 'react';
import { content } from '../data/content';
import { ContentContext } from '../App';

export default function About() {
  const siteData = useContext(ContentContext);
  const dbImage = siteData?.siteImages?.slice().reverse().find((img: any) => img.category === 'about')?.url;
  const aboutImageUrl = dbImage || content.about.image;
  const address = siteData?.contact?.address || 'Sojha Pinecone, Sojha Village\nBanjar Valley, Himachal Pradesh, India';

  return (
    <section id="about" className="py-24 px-6 bg-brand-muted w-full">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
                <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-4">Discover</p>
                <h2 className="font-serif text-4xl md:text-5xl text-brand-dark mb-6 leading-tight">Where Nature Meets Comfort</h2>
                <p className="text-gray-600 font-light leading-relaxed mb-8">
                    A cozy stay surrounded by lush deodar forests and panoramic Himalayan views. At Sojha Pinecone, we offer more than just accommodation—we provide an experience of tranquility, authenticity, and connection with nature.
                </p>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-start gap-4">
                    <i className="fa-solid fa-location-dot text-brand-accent mt-1"></i>
                    <div>
                        <h4 className="font-medium text-brand-dark mb-1">Find Us</h4>
                        <p className="text-sm text-gray-600 font-light whitespace-pre-line">{address}</p>
                    </div>
                </div>
            </div>
            <div className="relative h-[500px] rounded-lg overflow-hidden shadow-xl">
                <img src={aboutImageUrl} alt="Sojha Nature" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
            </div>
        </div>
      </div>
    </section>
  );
}
