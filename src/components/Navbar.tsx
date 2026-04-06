import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 backdrop-blur-md ${isScrolled ? 'bg-brand-light/90 shadow-sm' : 'bg-brand-light/90'}`} id="navbar">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <a href="#" className="font-serif text-2xl font-semibold text-brand-dark tracking-wide">Sojha Pinecone</a>
            <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-700">
                <a href="#about" className="hover:text-brand-accent transition">About</a>
                <a href="#rooms" className="hover:text-brand-accent transition">Rooms</a>
                <a href="#gallery" className="hover:text-brand-accent transition">Gallery</a>
                <a href="#explore" className="hover:text-brand-accent transition">Explore</a>
                <a href="#contact" className="hover:text-brand-accent transition">Contact</a>
            </div>
            <div className="flex items-center gap-4">
                <a
                    href="https://www.instagram.com/sojha_pinecone"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow us on Instagram"
                    className="text-brand-dark hover:text-brand-accent transition text-xl"
                >
                    <i className="fa-brands fa-instagram"></i>
                </a>
                <button onClick={scrollToContact} className="bg-brand-dark hover:bg-brand-accent text-white px-6 py-2 rounded-sm transition text-sm font-medium tracking-wide">
                    Book Now
                </button>
            </div>
        </div>
    </nav>
  );
}
