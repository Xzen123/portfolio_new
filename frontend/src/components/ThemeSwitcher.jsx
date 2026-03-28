import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useWindow } from '../context/WindowContext';
import { themes } from '../themes/themes';
import './ThemeSwitcher.css';

export default function ThemeSwitcher() {
  const { currentThemeName, setTheme } = useTheme();
  const { crtEnabled, toggleCRT } = useWindow();
  const [open, setOpen] = useState(false);

  // Keyboard shortcut: T to toggle
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 't' || e.key === 'T') {
        if (!e.target.matches('input, textarea')) setOpen((o) => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="theme-switcher">
      {/* Toggle Button */}
      <button
        className={`theme-toggle-btn ${open ? 'active' : ''}`}
        onClick={() => setOpen((o) => !o)}
        title="Toggle theme switcher (press T)"
        aria-label="Open theme switcher"
      >
        <span className="theme-toggle-icon">◈</span>
        <span className="theme-toggle-label">THEME</span>
      </button>

      {/* Panel */}
      <div className={`theme-panel ${open ? 'open' : ''}`}>
        <div className="theme-panel-header">
          <span className="prompt">$</span>
          <span className="cmd"> set-theme --list</span>
          <button className="close-btn" onClick={() => setOpen(false)}>✕</button>
        </div>
        <div className="theme-panel-body">
          {Object.values(themes).map((theme) => (
            <button
              key={theme.name}
              className={`theme-option ${currentThemeName === theme.name ? 'active' : ''}`}
              onClick={() => { setTheme(theme.name); setOpen(false); }}
              style={{
                '--opt-primary': theme.colors.primary,
                '--opt-secondary': theme.colors.secondary,
                '--opt-glow': theme.colors.glow,
              }}
            >
              <span className="theme-swatch">
                <span className="swatch-dot" style={{ background: theme.colors.primary }} />
                <span className="swatch-dot" style={{ background: theme.colors.secondary }} />
              </span>
              <span className="theme-icon">{theme.icon}</span>
              <span className="theme-name">{theme.label}</span>
              {theme.minimal && <span style={{ fontSize: 9, color: 'var(--color-text-dim)', marginLeft: 'auto' }}>NO-FX</span>}
              {currentThemeName === theme.name && (
                <span className="active-badge">[ACTIVE]</span>
              )}
            </button>
          ))}
        </div>

        {/* CRT Toggle */}
        <div className="theme-panel-crt">
          <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 11, color: 'var(--color-text-dim)' }}>CRT Effect</span>
          <button
            onClick={toggleCRT}
            className={`crt-toggle-btn ${crtEnabled ? 'on' : 'off'}`}
          >
            {crtEnabled ? '● ON' : '○ OFF'}
          </button>
        </div>

        <div className="theme-panel-footer">
          <span className="hint">Press </span>
          <kbd>T</kbd>
          <span className="hint"> to toggle · </span>
          <kbd>ESC</kbd>
          <span className="hint"> to close</span>
        </div>
      </div>
    </div>
  );
}
