export default function Footer() {
  return (
    <footer className="bg-[#15241b] text-white/50 py-10 text-center text-sm font-light">
      <div className="flex flex-col items-center gap-4">
        <a
          href="https://www.instagram.com/sojhapinecone"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-white/70 hover:text-brand-light transition-colors duration-200 text-sm"
          aria-label="Follow us on Instagram"
        >
          <i className="fa-brands fa-instagram text-xl"></i>
          <span>Follow Us on Instagram</span>
        </a>
        <p>&copy; 2026 Sojha Pinecone. All rights reserved. | Created for AI Engineer Journey.</p>
      </div>
    </footer>
  );
}
