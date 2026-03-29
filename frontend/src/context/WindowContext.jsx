import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const WindowContext = createContext(null);

export function WindowProvider({ children }) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [crtEnabled, setCrtEnabled] = useState(() => {
    return localStorage.getItem('crt-enabled') !== 'false';
  });
  const [reduceMotion, setReduceMotion] = useState(() => {
    return localStorage.getItem('reduce-motion') === 'true';
  });

  // Sync fullscreen state with browser
  useEffect(() => {
    const onFSChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFSChange);
    return () => document.removeEventListener('fullscreenchange', onFSChange);
  }, []);

  const minimize = useCallback(() => setIsMinimized(true), []);
  const restore = useCallback(() => setIsMinimized(false), []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  const toggleCRT = useCallback(() => {
    setCrtEnabled((v) => {
      localStorage.setItem('crt-enabled', String(!v));
      return !v;
    });
  }, []);

  const toggleReduceMotion = useCallback(() => {
    setReduceMotion((v) => {
      localStorage.setItem('reduce-motion', String(!v));
      return !v;
    });
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }
  }, [reduceMotion]);

  return (
    <WindowContext.Provider
      value={{
        isMinimized,
        isFullscreen,
        crtEnabled,
        reduceMotion,
        minimize,
        restore,
        toggleFullscreen,
        toggleCRT,
        toggleReduceMotion,
      }}
    >
      {children}
    </WindowContext.Provider>
  );
}

export function useWindow() {
  const ctx = useContext(WindowContext);
  if (!ctx) throw new Error('useWindow must be used within WindowProvider');
  return ctx;
}
