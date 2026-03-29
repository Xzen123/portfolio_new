import { useState, useEffect, useRef } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { WindowProvider, useWindow } from './context/WindowContext';
import CRTOverlay from './components/CRTOverlay';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import MinimizedScreen from './components/MinimizedScreen';
import LoadingScreen from './components/LoadingScreen';
import './App.css';

function AppInner() {
  const { isMinimized } = useWindow();
  const [animClass, setAnimClass] = useState('');
  const [isCompact, setIsCompact] = useState(false);
  const prevMinimizedRef = useRef(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 980px)');
    const sync = () => setIsCompact(media.matches);
    sync();
    if (media.addEventListener) {
      media.addEventListener('change', sync);
      return () => media.removeEventListener('change', sync);
    }
    media.addListener(sync);
    return () => media.removeListener(sync);
  }, []);

  useEffect(() => {
    if (prevMinimizedRef.current && !isMinimized) {
      setAnimClass('portfolio-restore');
      const t = setTimeout(() => setAnimClass(''), 700);
      prevMinimizedRef.current = false;
      return () => clearTimeout(t);
    }
    if (isMinimized) prevMinimizedRef.current = true;
  }, [isMinimized]);

  if (isMinimized) {
    return <MinimizedScreen />;
  }

  return (
    <div className={animClass}>
      <CRTOverlay />
      <Navbar />
      <main
        id="main-content"
        style={{ paddingTop: isCompact ? 102 : 56, paddingBottom: isCompact ? 100 : 64 }}
      >
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(() => {
    return sessionStorage.getItem('portfolio-loaded') !== 'true';
  });

  const handleLoadingComplete = () => {
    sessionStorage.setItem('portfolio-loaded', 'true');
    setLoading(false);
  };

  return (
    <ThemeProvider>
      <WindowProvider>
        {loading && <LoadingScreen onComplete={handleLoadingComplete} />}
        {!loading && <AppInner />}
      </WindowProvider>
    </ThemeProvider>
  );
}
