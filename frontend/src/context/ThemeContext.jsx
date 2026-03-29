import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { themes, defaultTheme } from '../themes/themes';

const ThemeContext = createContext(null);
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
  root.setAttribute('data-theme', theme.name);

  if (theme.minimal) {
    document.body.classList.add('theme-minimal');
  } else {
    document.body.classList.remove('theme-minimal');
  }

  if (theme.name === 'liquidglass') {
    document.body.classList.add('theme-liquidglass');
  } else {
    document.body.classList.remove('theme-liquidglass');
  }
}

export function ThemeProvider({ children }) {
  const [currentThemeName, setCurrentThemeName] = useState(defaultTheme);

  // Load theme from localStorage on mount — no backend call needed
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY) || defaultTheme;
    const theme = themes[saved] || themes[defaultTheme];
    setCurrentThemeName(theme.name);
    applyTheme(theme);
  }, []);

  const setTheme = useCallback((name) => {
    if (!themes[name]) return;
    setCurrentThemeName(name);
    applyTheme(themes[name]);
    localStorage.setItem(LS_KEY, name);
  }, []);

  return (
    <ThemeContext.Provider value={{ currentThemeName, currentTheme: themes[currentThemeName], setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
