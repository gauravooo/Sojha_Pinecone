import { useEffect, useState, createContext } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Rooms from './components/Rooms';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Explore from './components/Explore';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Admin from './components/Admin';

export const ContentContext = createContext<any>(null);

function App() {
  const [siteData, setSiteData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => setSiteData(data))
      .catch(console.error);
  }, []);

  if (window.location.pathname === '/admin') {
    return <Admin />;
  }

  return (
    <ContentContext.Provider value={siteData}>
      <Navbar />
      <Hero />
      <About />
      <Rooms />
      <Services />
      <Gallery />
      <Explore />
      <Contact />
      <Footer />
    </ContentContext.Provider>
  );
}

export default App;
