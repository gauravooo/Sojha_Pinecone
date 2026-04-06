import { useContext } from 'react';
import { content } from '../data/content';
import { ContentContext } from '../App';

export default function Hero() {
  const siteData = useContext(ContentContext);
  const dbImage = siteData?.siteImages?.slice().reverse().find((img: any) => img.category === 'hero')?.url;
  const bgImageUrl = dbImage || content.hero.bgImage;

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      className="hero-bg h-screen flex items-center justify-center text-center px-4"
      style={{ '--hero-bg': `url('${bgImageUrl}')` } as React.CSSProperties}
    >
        <div className="max-w-3xl animate-fade-in-up">
            <p className="text-white/80 tracking-[0.2em] text-sm font-semibold uppercase mb-4">{content.hero.subtitle}</p>
            <h1 className="font-serif text-5xl md:text-7xl text-white font-medium mb-6 leading-tight">
                {content.hero.titleLine1} <br/> {content.hero.titleLine2}
            </h1>
            <p className="text-lg md:text-xl text-white/90 font-light mb-10">
                {content.hero.description}
            </p>
            <button onClick={scrollToContact} className="bg-brand-dark hover:bg-brand-accent text-white px-8 py-3 rounded-sm transition text-sm font-medium tracking-wide inline-flex items-center gap-2">
                Book Your Stay <i className="fa-solid fa-arrow-right text-xs"></i>
            </button>
        </div>
    </section>
  );
}
