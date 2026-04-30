import { useState, useEffect, useCallback, useRef } from 'react';

type GalleryImage = {
  id: number;
  url: string;
  alt: string;
};

// How many images to show in the desktop grid (2 rows × 3 cols = 6)
const DESKTOP_VISIBLE = 6;

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Mobile carousel state
  const [carouselIndex, setCarouselIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const minSwipe = 50;

  useEffect(() => {
    async function fetchGallery() {
      try {
        const response = await fetch('/api/gallery');
        const data = await response.json();
        setImages(data.images || []);
      } catch (error) {
        console.error('Error loading gallery:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  /* ── Lightbox navigation ── */
  const showNext = useCallback(
    (e?: React.MouseEvent | KeyboardEvent) => {
      e?.stopPropagation();
      if (lightboxIndex !== null && images.length > 0)
        setLightboxIndex((lightboxIndex + 1) % images.length);
    },
    [lightboxIndex, images]
  );

  const showPrev = useCallback(
    (e?: React.MouseEvent | KeyboardEvent) => {
      e?.stopPropagation();
      if (lightboxIndex !== null && images.length > 0)
        setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
    },
    [lightboxIndex, images]
  );

  const closeLightbox = () => setLightboxIndex(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowRight') showNext(e);
      if (e.key === 'ArrowLeft') showPrev(e);
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, showNext, showPrev]);

  /* ── Mobile carousel swipe handlers ── */
  const onCarouselTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };
  const onCarouselTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };
  const onCarouselTouchEnd = () => {
    if (touchStartX.current == null || touchEndX.current == null) return;
    const dist = touchStartX.current - touchEndX.current;
    if (dist > minSwipe) setCarouselIndex((i) => (i + 1) % images.length);
    else if (dist < -minSwipe) setCarouselIndex((i) => (i - 1 + images.length) % images.length);
  };

  /* ── Lightbox swipe (reuse same vars for lightbox) ── */
  const lbTouchStart = useRef<number | null>(null);
  const lbTouchEnd = useRef<number | null>(null);
  const onLbTouchStart = (e: React.TouchEvent) => {
    lbTouchStart.current = e.targetTouches[0].clientX;
    lbTouchEnd.current = null;
  };
  const onLbTouchMove = (e: React.TouchEvent) => {
    lbTouchEnd.current = e.targetTouches[0].clientX;
  };
  const onLbTouchEnd = () => {
    if (lbTouchStart.current == null || lbTouchEnd.current == null) return;
    const dist = lbTouchStart.current - lbTouchEnd.current;
    if (dist > minSwipe) showNext();
    else if (dist < -minSwipe) showPrev();
  };

  /* ── Desktop grid: show up to DESKTOP_VISIBLE images ── */
  const visibleImages = images.slice(0, DESKTOP_VISIBLE);
  const extraCount = images.length - DESKTOP_VISIBLE;

  return (
    <section id="gallery" className="py-24 px-6 bg-white w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold tracking-[0.2em] text-brand-accent uppercase mb-3">Memories</p>
          <h2 className="font-serif text-4xl md:text-5xl text-brand-dark">Moments from Sojha</h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <i className="fa-solid fa-circle-notch fa-spin text-4xl text-brand-accent"></i>
          </div>
        ) : images.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">No photos yet.</p>
        ) : (
          <>
            {/* ── MOBILE CAROUSEL ── */}
            <div className="block md:hidden relative overflow-hidden rounded-2xl shadow-lg">
              {/* Slides */}
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
                onTouchStart={onCarouselTouchStart}
                onTouchMove={onCarouselTouchMove}
                onTouchEnd={onCarouselTouchEnd}
              >
                {images.map((img) => (
                  <div key={img.id} className="flex-[0_0_100%] w-full aspect-[4/3] relative">
                    <img
                      src={img.url}
                      alt={img.alt}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                      onClick={() => setLightboxIndex(carouselIndex)}
                    />
                  </div>
                ))}
              </div>

              {/* Prev / Next arrows */}
              <button
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white w-9 h-9 rounded-full flex items-center justify-center transition"
                onClick={() => setCarouselIndex((i) => (i - 1 + images.length) % images.length)}
                aria-label="Previous"
              >
                <i className="fa-solid fa-chevron-left text-sm"></i>
              </button>
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white w-9 h-9 rounded-full flex items-center justify-center transition"
                onClick={() => setCarouselIndex((i) => (i + 1) % images.length)}
                aria-label="Next"
              >
                <i className="fa-solid fa-chevron-right text-sm"></i>
              </button>

              {/* Expand icon */}
              <button
                className="absolute top-3 right-3 bg-black/40 hover:bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center transition"
                onClick={() => setLightboxIndex(carouselIndex)}
                aria-label="View fullscreen"
              >
                <i className="fa-solid fa-expand text-xs"></i>
              </button>

              {/* Dot indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCarouselIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === carouselIndex ? 'bg-white w-5' : 'bg-white/50'
                    }`}
                    aria-label={`Go to photo ${i + 1}`}
                  />
                ))}
              </div>

              {/* Counter */}
              <div className="absolute top-3 left-3 bg-black/40 text-white text-xs px-2 py-1 rounded-full font-medium">
                {carouselIndex + 1} / {images.length}
              </div>
            </div>

            {/* ── DESKTOP GRID (bento: image 0 is 2×2, rest are 1×1) ── */}
            <div className="hidden md:grid grid-cols-3 gap-4 auto-rows-[250px]">
              {visibleImages.map((img, index) => {
                const isLastSlot = index === DESKTOP_VISIBLE - 1 && extraCount > 0;
                // First image is the hero tile
                const spanClass = index === 0 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1';

                return (
                  <div
                    key={img.id}
                    className={`${spanClass} rounded-xl overflow-hidden cursor-pointer group relative`}
                    onClick={() => setLightboxIndex(index)}
                  >
                    <img
                      src={img.url}
                      alt={img.alt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Normal hover overlay */}
                    {!isLastSlot && (
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                        <i className="fa-solid fa-expand text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-50 group-hover:scale-100 transform"></i>
                      </div>
                    )}

                    {/* "+X more" overlay on last slot */}
                    {isLastSlot && (
                      <div
                        className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLightboxIndex(DESKTOP_VISIBLE - 1);
                        }}
                      >
                        <span className="text-white text-4xl font-bold">+{extraCount}</span>
                        <span className="text-white/80 text-sm tracking-widest uppercase">more photos</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* ── LIGHTBOX ── */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12 animate-fade-in"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            className="absolute top-6 right-6 text-white/50 hover:text-white transition p-2 z-50 focus:outline-none"
            onClick={closeLightbox}
          >
            <i className="fa-solid fa-xmark text-4xl"></i>
          </button>

          {/* Prev */}
          <button
            className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 z-50 text-white/50 hover:text-white transition p-4 focus:outline-none hidden md:block"
            onClick={showPrev}
          >
            <i className="fa-solid fa-chevron-left text-4xl"></i>
          </button>

          {/* Image */}
          <div
            className="relative w-full max-w-6xl max-h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onLbTouchStart}
            onTouchMove={onLbTouchMove}
            onTouchEnd={onLbTouchEnd}
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

          {/* Next */}
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
