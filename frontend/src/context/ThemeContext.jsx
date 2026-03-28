import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { themes, defaultTheme } from '../themes/themes';

const ThemeContext = createContext(null);

const API_URL = 'http://localhost:5000/api/theme';
const LS_KEY = 'portfolio-theme';

function applyTheme(theme) {
  const root = document.documentElement;
  const c = theme.colors;
  root.style.setProperty('--color-primary', c.primary);
  root.style.setProperty('--color-secondary', c.secondary);
  root.style.setProperty('--color-bg', c.bg);
  root.style.setProperty('--color-surface', c.bgSurface);
  root.style.setProperty('--color-card', c.bgCard);
  root.style.setProperty('--color-text', c.text);
  root.style.setProperty('--color-text-dim', c.textDim);
  root.style.setProperty('--color-border', c.border);
  root.style.setProperty('--color-border-hover', c.borderHover);
  root.style.setProperty('--color-glow', c.glow);
  root.style.setProperty('--color-glow-secondary', c.glowSecondary);
  root.style.setProperty('--color-scanline', c.scanline);
  document.body.style.backgroundColor = c.bg;
  // Set data-theme on <html> for cursor CSS selectors
  root.setAttribute('data-theme', theme.name);
  // Toggle minimal mode globally
  if (theme.minimal) {
    document.body.classList.add('theme-minimal');
  } else {
    document.body.classList.remove('theme-minimal');
  }
}



export function ThemeProvider({ children }) {
  const [currentThemeName, setCurrentThemeName] = useState(defaultTheme);
  const [isLoading, setIsLoading] = useState(true);

  // Load theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const res = await fetch(API_URL, { signal: AbortSignal.timeout(2000) });
        const data = await res.json();
        if (data.themeName && themes[data.themeName]) {
          setCurrentThemeName(data.themeName);
          applyTheme(themes[data.themeName]);
          localStorage.setItem(LS_KEY, data.themeName);
        }
      } catch {
        // Fallback to localStorage
        const saved = localStorage.getItem(LS_KEY) || defaultTheme;
        setCurrentThemeName(saved);
        applyTheme(themes[saved] || themes[defaultTheme]);
      } finally {
        setIsLoading(false);
      }
    };
    loadTheme();
  }, []);

  const setTheme = useCallback(async (name) => {
    if (!themes[name]) return;
    setCurrentThemeName(name);
    applyTheme(themes[name]);
    localStorage.setItem(LS_KEY, name);
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeName: name }),
        signal: AbortSignal.timeout(2000),
      });
    } catch {
      // Silently fail — localStorage already saved it
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ currentThemeName, currentTheme: themes[currentThemeName], setTheme, isLoading, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
