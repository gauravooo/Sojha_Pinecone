import { useState, useEffect, useContext } from 'react';
import { content } from '../data/content';
import { ContentContext } from '../App';

type Room = {
  id: string;
  name: string;
  description: string;
  features: string[];
  original_price: number | null;
  current_price: number | null;
};

const FALLBACK_ROOM: Room = {
  id: 'room_deluxe',
  name: 'Deluxe Mountain View',
  description:
    'Our signature rooms offer breathtaking views of the Himalayan peaks. Wake up to misty mountains and fall asleep to the sound of rustling pines. Designed with warm wood accents and premium linens.',
  features: content.rooms.deluxe.features,
  original_price: null,
  current_price: null,
};

/* ── Price badge ── */
function PriceDisplay({ room }: { room: Room }) {
  const { original_price, current_price } = room;
  if (!current_price) return null;

  const hasDiscount = original_price && original_price > current_price;
  const discountPct = hasDiscount
    ? Math.round((1 - current_price / original_price!) * 100)
    : 0;

  return (
    <div className="mt-8 flex items-end gap-4">
      <div>
        {hasDiscount && (
          <p className="text-gray-400 line-through text-base mb-0.5">
            ₹{original_price!.toLocaleString('en-IN')}
          </p>
        )}
        <p className="text-brand-dark font-sans text-3xl font-bold tracking-tight">
          ₹{current_price.toLocaleString('en-IN')}
          <span className="text-sm font-sans font-normal text-gray-500 ml-1">/night</span>
        </p>
      </div>
      {hasDiscount && (
        <span className="mb-1 inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full tracking-wide">
          {discountPct}% OFF
        </span>
      )}
    </div>
  );
}

/* ── Per-room image carousel ── */
function RoomCarousel({ images, roomName }: { images: string[]; roomName: string }) {
  const [idx, setIdx] = useState(0);

  const prev = () => setIdx((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIdx((i) => (i === images.length - 1 ? 0 : i + 1));

  // No images yet — show placeholder
  if (images.length === 0) {
    return (
      <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg bg-stone-100 flex flex-col items-center justify-center gap-3 text-stone-400">
        <i className="fa-regular fa-image text-5xl" />
        <p className="text-sm tracking-wide">No photos yet</p>
      </div>
    );
  }

  return (
    <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg group">
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${idx * 100}%)` }}
      >
        {images.map((src, i) => (
          <div key={i} className="min-w-full h-full flex-shrink-0">
            <img
              src={src}
              alt={`${roomName} view ${i + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow"
          >
            <i className="fa-solid fa-chevron-left" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow"
          >
            <i className="fa-solid fa-chevron-right" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === i ? 'bg-white w-5' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Room card (alternates layout by index) ── */
function RoomCard({
  room,
  index,
  images,
  loadingRooms,
}: {
  room: Room;
  index: number;
  images: string[];
  loadingRooms: boolean;
}) {
  // odd index → image on right (content left); even → image left (content right)
  const imageRight = index % 2 !== 0;

  const imageCol = (
    <RoomCarousel images={images} roomName={room.name} />
  );

  const contentCol = (
    <div className="flex flex-col justify-center">
      <h3 className="font-serif text-3xl text-brand-dark mb-4">{room.name}</h3>
      <p className="text-gray-600 font-light mb-8 leading-relaxed">{room.description}</p>
      <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
        {room.features.map((feature, i) => (
          <p key={i}>
            <i className="fa-regular fa-circle-check text-brand-accent mr-2" />
            {feature}
          </p>
        ))}
      </div>
      {!loadingRooms && <PriceDisplay room={room} />}
    </div>
  );

  return (
    <>
      {/* Desktop: alternating layout | Mobile: always image → content */}
      <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        {/* Mobile always shows image first; desktop alternates */}
        <div className={`order-1 ${imageRight ? 'md:order-2' : 'md:order-1'}`}>
          {imageCol}
        </div>
        <div className={`order-2 ${imageRight ? 'md:order-1' : 'md:order-2'}`}>
          {contentCol}
        </div>
      </div>

      {/* Subtle divider between rooms (not after last) */}
    </>
  );
}

/* ── Section ── */
export default function Rooms() {
  const siteData = useContext(ContentContext);
  const allRoomImages: { category: string; url: string }[] = siteData?.roomImages || [];

  const [rooms, setRooms] = useState<Room[]>([FALLBACK_ROOM]);
  const [loadingRooms, setLoadingRooms] = useState(true);

  useEffect(() => {
    fetch('/api/rooms')
      .then((r) => r.json())
      .then((data) => {
        if (data.rooms && data.rooms.length > 0) setRooms(data.rooms);
      })
      .catch(console.error)
      .finally(() => setLoadingRooms(false));
  }, []);

  return (
    <section id="rooms" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-2">
            Accommodation
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-brand-dark">Our Rooms</h2>
        </div>

        <div className="space-y-24">
          {rooms.map((room, index) => {
            // Match images by room id used as category (e.g. 'room_deluxe')
            const imgs = allRoomImages
              .filter((img) => img.category === room.id)
              .map((img) => img.url);

            // Fallback to static image for room_deluxe
            const images =
              imgs.length > 0
                ? imgs
                : room.id === 'room_deluxe'
                ? [content.rooms.deluxe.image]
                : [];

            return (
              <div key={room.id}>
                <RoomCard
                  room={room}
                  index={index}
                  images={images}
                  loadingRooms={loadingRooms}
                />
                {index < rooms.length - 1 && (
                  <div className="mt-24 border-t border-gray-100" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
