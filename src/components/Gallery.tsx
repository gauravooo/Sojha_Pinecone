import { useState, useEffect, useCallback } from 'react';

type GalleryImage = {
  id: number;
  url: string;
  alt: string;
};

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const response = await fetch('/api/gallery');
        const data = await response.json();
        setImages(data.images || []);
      } catch (error) {
        console.error("Error loading gallery:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  // Handle Swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      showNext();
    } else if (isRightSwipe) {
      showPrev();
    }
  };

  const showNext = useCallback((e?: React.MouseEvent | KeyboardEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null && images.length > 0) {
      setLightboxIndex((lightboxIndex + 1) % images.length);
    }
  }, [lightboxIndex, images]);

  const showPrev = useCallback((e?: React.MouseEvent | KeyboardEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null && images.length > 0) {
      setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
    }
  }, [lightboxIndex, images]);

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'Escape') closeLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, showNext, showPrev]);

  return (
    <section id="gallery" className="py-24 px-6 bg-white w-full">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <p className="text-xs font-semibold tracking-[0.2em] text-brand-accent uppercase mb-3">Memories</p>
                <h2 className="font-serif text-4xl md:text-5xl text-brand-dark">Moments from Sojha</h2>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <i className="fa-solid fa-circle-notch fa-spin text-4xl text-brand-accent"></i>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
                  {images.map((img, index) => {
                      let spanClasses = "col-span-1 row-span-1";
                      if (index === 0) spanClasses = "col-span-1 lg:col-span-2 row-span-2";
                      
                      return (
                        <div 
                          key={img.id} 
                          className={`${spanClasses} rounded-xl overflow-hidden cursor-pointer group relative`}
                          onClick={() => setLightboxIndex(index)}
                        >
                            <img src={img.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={img.alt} loading="lazy" />
                            <div className="absolute inset-0 bg-black/opacity-0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                              <i className="fa-solid fa-expand text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-50 group-hover:scale-100 transform"></i>
                            </div>
                        </div>
                      );
                  })}
              </div>
            )}
        </div>

        {/* Lightbox Carousel */}
        {lightboxIndex !== null && (
          <div 
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12 animate-fade-in"
            onClick={closeLightbox}
          >
            <button 
              className="absolute top-6 right-6 text-white/50 hover:text-white transition p-2 z-50 focus:outline-none"
              onClick={closeLightbox}
            >
              <i className="fa-solid fa-xmark text-4xl"></i>
            </button>
            
            <button 
              className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 z-50 text-white/50 hover:text-white transition p-4 focus:outline-none hidden md:block"
              onClick={showPrev}
            >
              <i className="fa-solid fa-chevron-left text-4xl"></i>
            </button>

            <div 
              className="relative w-full max-w-6xl max-h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEndHandler}
            >
              <img 
                src={images[lightboxIndex].url} 
                alt={images[lightboxIndex].alt} 
                className="max-w-full max-h-[85vh] object-contain select-none shadow-2xl rounded-sm"
                draggable={false}
              />
              <div className="absolute -bottom-10 left-0 right-0 text-center text-white/70 text-sm font-light tracking-wide">
                {lightboxIndex + 1} / {images.length}
              </div>
            </div>

            <button 
              className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-50 text-white/50 hover:text-white transition p-4 focus:outline-none hidden md:block"
              onClick={showNext}
            >
              <i className="fa-solid fa-chevron-right text-4xl"></i>
            </button>
          </div>
        )}
    </section>
  );
}
