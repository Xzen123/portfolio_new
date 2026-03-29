import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useWindow } from '../context/WindowContext';

export default function Navbar() {
  const { currentTheme, currentThemeName, setTheme, themes } = useTheme();
  const {
    minimize,
    toggleFullscreen,
    isFullscreen,
    crtEnabled,
    toggleCRT,
    reduceMotion,
    toggleReduceMotion,
  } = useWindow();
  const [scrolled, setScrolled] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const isMinimal = currentTheme?.minimal;
  const isLiquidGlass = currentTheme?.name === 'liquidglass';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setSettingsOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Close settings when clicking outside
  useEffect(() => {
    if (!settingsOpen) return;
    const handleClick = (e) => {
      if (!e.target.closest('[data-navbar-settings]')) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [settingsOpen]);

  const navLinks = ['about', 'skills', 'experience', 'projects', 'contact'];
  const themeNames = Object.keys(themes || {});

  const cycleTheme = () => {
    if (!themeNames.length) return;
    const currentIndex = Math.max(0, themeNames.indexOf(currentThemeName));
    const nextIndex = (currentIndex + 1) % themeNames.length;
    setTheme(themeNames[nextIndex]);
  };

  /* ── Shared style helpers ── */
  const headerBg = () => {
    if (isLiquidGlass) {
      return scrolled
        ? 'rgba(6, 12, 24, 0.72)'
        : 'rgba(6, 12, 24, 0.45)';
    }
    if (scrolled) return 'color-mix(in srgb, var(--color-surface) 96%, transparent)';
    return isMinimal ? 'var(--color-surface)' : 'rgba(0,0,0,0.6)';
  };

  const settingsBtnStyle = (active = false) => ({
    fontFamily: "'Roboto Mono', monospace",
    fontSize: 10,
    letterSpacing: '0.07em',
    color: active ? 'var(--color-bg)' : 'var(--color-primary)',
    border: '1px solid var(--color-border)',
    background: active ? 'var(--color-primary)' : 'transparent',
    padding: '5px 10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: active ? '0 0 10px var(--color-glow)' : 'none',
    borderRadius: isLiquidGlass ? 8 : 0,
    whiteSpace: 'nowrap',
  });

  const handleSettingsHover = (e, enter) => {
    if (!e.currentTarget.dataset.active) {
      e.currentTarget.style.borderColor = enter ? 'var(--color-primary)' : 'var(--color-border)';
      e.currentTarget.style.boxShadow = enter ? '0 0 8px var(--color-glow)' : 'none';
    }
  };

  /* ── Settings Panel ── */
  const renderSettingsPanel = () => (
    <div
      data-navbar-settings
      style={{
        width: '100%',
        border: settingsOpen ? '1px solid var(--color-primary)' : '1px solid transparent',
        background: isLiquidGlass
          ? 'rgba(6, 12, 24, 0.75)'
          : 'color-mix(in srgb, var(--color-card) 94%, transparent)',
        backdropFilter: isLiquidGlass ? 'blur(28px) saturate(180%)' : 'none',
        WebkitBackdropFilter: isLiquidGlass ? 'blur(28px) saturate(180%)' : 'none',
        padding: settingsOpen ? '10px 12px' : 0,
        boxShadow: settingsOpen ? '0 8px 32px var(--color-glow)' : 'none',
        maxHeight: settingsOpen ? 240 : 0,
        opacity: settingsOpen ? 1 : 0,
        transform: settingsOpen ? 'translateY(0)' : 'translateY(-8px)',
        overflow: 'hidden',
        pointerEvents: settingsOpen ? 'auto' : 'none',
        transition: 'max-height 0.34s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.22s ease, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), padding 0.24s ease, box-shadow 0.24s ease',
        borderRadius: isLiquidGlass ? '0 0 12px 12px' : 0,
      }}
    >
      <div style={{ marginBottom: 6, fontFamily: "'Roboto Mono', monospace", fontSize: 9, letterSpacing: '0.12em', color: 'var(--color-text-dim)' }}>
        APPEARANCE
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
        {/* Theme cycle */}
        <button
          onClick={cycleTheme}
          onMouseEnter={e => handleSettingsHover(e, true)}
          onMouseLeave={e => handleSettingsHover(e, false)}
          style={{
            ...settingsBtnStyle(),
            opacity: settingsOpen ? 1 : 0,
            transform: settingsOpen ? 'translateY(0) scale(1)' : 'translateY(-5px) scale(0.98)',
            transition: 'opacity 0.2s ease 30ms, transform 0.3s cubic-bezier(0.22,1,0.36,1) 30ms, border-color 0.2s, box-shadow 0.2s',
          }}
          aria-label="Cycle theme"
        >
          THEME: {currentThemeName?.toUpperCase()}
        </button>

        {/* Individual theme buttons */}
        {Object.values(themes || {}).map((t, i) => (
          <button
            key={t.name}
            onClick={() => { setTheme(t.name); }}
            style={{
              ...settingsBtnStyle(currentThemeName === t.name),
              opacity: settingsOpen ? 1 : 0,
              transform: settingsOpen ? 'translateY(0)' : 'translateY(-5px)',
              transition: `opacity 0.2s ease ${50 + i * 30}ms, transform 0.3s cubic-bezier(0.22,1,0.36,1) ${50 + i * 30}ms, border-color 0.2s, box-shadow 0.2s, background 0.15s, color 0.15s`,
              fontSize: 9,
              padding: '4px 7px',
            }}
            aria-label={`Switch to ${t.label} theme`}
            aria-pressed={currentThemeName === t.name}
          >
            {t.icon} {t.name.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 6, fontFamily: "'Roboto Mono', monospace", fontSize: 9, letterSpacing: '0.12em', color: 'var(--color-text-dim)' }}>
        DISPLAY
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {/* CRT Toggle */}
        <button
          onClick={toggleCRT}
          onMouseEnter={e => handleSettingsHover(e, true)}
          onMouseLeave={e => handleSettingsHover(e, false)}
          style={{
            ...settingsBtnStyle(crtEnabled),
            opacity: settingsOpen ? 1 : 0,
            transform: settingsOpen ? 'translateY(0) scale(1)' : 'translateY(-5px) scale(0.98)',
            transition: 'opacity 0.2s ease 80ms, transform 0.3s cubic-bezier(0.22,1,0.36,1) 80ms, border-color 0.2s, box-shadow 0.2s, background 0.15s, color 0.15s',
          }}
          aria-label="Toggle CRT effect"
          aria-pressed={crtEnabled}
        >
          CRT OVERLAY: {crtEnabled ? 'ON' : 'OFF'}
        </button>

        {/* Minimize */}
        <button
          onClick={minimize}
          onMouseEnter={e => handleSettingsHover(e, true)}
          onMouseLeave={e => handleSettingsHover(e, false)}
          style={{
            ...settingsBtnStyle(),
            opacity: settingsOpen ? 1 : 0,
            transform: settingsOpen ? 'translateY(0)' : 'translateY(-5px)',
            transition: 'opacity 0.2s ease 110ms, transform 0.3s cubic-bezier(0.22,1,0.36,1) 110ms, border-color 0.2s, box-shadow 0.2s',
          }}
          aria-label="Minimize window to dock"
        >
          MINIMIZE
        </button>

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          onMouseEnter={e => handleSettingsHover(e, true)}
          onMouseLeave={e => handleSettingsHover(e, false)}
          style={{
            ...settingsBtnStyle(isFullscreen),
            opacity: settingsOpen ? 1 : 0,
            transform: settingsOpen ? 'translateY(0)' : 'translateY(-5px)',
            transition: 'opacity 0.2s ease 140ms, transform 0.3s cubic-bezier(0.22,1,0.36,1) 140ms, border-color 0.2s, box-shadow 0.2s, background 0.15s, color 0.15s',
          }}
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          aria-pressed={isFullscreen}
        >
          {isFullscreen ? 'EXIT FULLSCREEN' : 'FULLSCREEN'}
        </button>
      </div>

      <div style={{ margin: '10px 0 6px', fontFamily: "'Roboto Mono', monospace", fontSize: 9, letterSpacing: '0.12em', color: 'var(--color-text-dim)' }}>
        PREFERENCES
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <button
          onClick={toggleReduceMotion}
          onMouseEnter={e => handleSettingsHover(e, true)}
          onMouseLeave={e => handleSettingsHover(e, false)}
          style={{
            ...settingsBtnStyle(reduceMotion),
            opacity: settingsOpen ? 1 : 0,
            transform: settingsOpen ? 'translateY(0)' : 'translateY(-5px)',
            transition: 'opacity 0.2s ease 160ms, transform 0.3s cubic-bezier(0.22,1,0.36,1) 160ms, border-color 0.2s, box-shadow 0.2s, background 0.15s, color 0.15s',
          }}
          aria-label="Toggle reduced motion"
          aria-pressed={reduceMotion}
        >
          REDUCED MOTION: {reduceMotion ? 'ON' : 'OFF'}
        </button>
      </div>
    </div>
  );

  return (
    <header
      role="banner"
      data-navbar-settings
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: headerBg(),
        backdropFilter: (scrolled || isLiquidGlass) ? 'blur(20px) saturate(160%)' : 'none',
        WebkitBackdropFilter: (scrolled || isLiquidGlass) ? 'blur(20px) saturate(160%)' : 'none',
        borderBottom: `1px solid ${isLiquidGlass ? 'rgba(168,216,255,0.12)' : 'var(--color-border)'}`,
        boxShadow: scrolled && !isMinimal ? '0 4px 30px var(--color-glow)' : 'none',
        transition: 'background 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease, backdrop-filter 0.35s ease',
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 1400,
        margin: '0 auto',
        padding: isCompact ? '8px 14px 10px' : '0 20px',
      }}>
        {/* ── Main bar ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isCompact ? '1fr auto 1fr' : '1fr 1fr 1fr',
          alignItems: 'center',
          minHeight: isCompact ? 52 : 56,
          gap: 8,
        }}>

          {/* LEFT: empty spacing anchor */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-start' }}>
            {!isCompact && (
              <span
                style={{
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: 10,
                  color: 'var(--color-text-dim)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                Studio Mode
              </span>
            )}
          </div>

          {/* CENTER: Logo */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <a
              href="#"
              style={{
                fontFamily: "'Roboto Mono', monospace",
                color: 'var(--color-primary)',
                fontWeight: 700,
                fontSize: isCompact ? 11 : 13,
                letterSpacing: '0.08em',
                textDecoration: 'none',
                textShadow: (isMinimal || isLiquidGlass) ? 'none' : '0 0 12px var(--color-glow)',
                whiteSpace: 'nowrap',
              }}
              aria-label="Home"
            >
              alok@portfolio:~$
            </a>
          </div>

          {/* RIGHT: Nav + hamburger/settings */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
            {isCompact ? (
              /* Mobile: hamburger + settings button */
              <>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-label="Toggle navigation menu"
                  aria-expanded={menuOpen}
                  aria-controls="mobile-main-navigation"
                  style={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: 3,
                    width: 34,
                    height: 26,
                    background: 'transparent',
                    border: '1px solid var(--color-border)',
                    cursor: 'pointer',
                    padding: '4px 7px',
                    transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
                    boxShadow: menuOpen ? '0 0 12px var(--color-glow)' : 'none',
                    borderRadius: isLiquidGlass ? 6 : 0,
                  }}
                >
                  {[0, 1, 2].map((bar) => (
                    <span
                      key={bar}
                      style={{
                        display: 'block',
                        width: '100%',
                        height: 2,
                        background: 'var(--color-primary)',
                        boxShadow: '0 0 4px var(--color-glow)',
                        transition: 'transform 0.25s ease, opacity 0.25s ease',
                        transform:
                          bar === 0 ? (menuOpen ? 'translateY(5px) rotate(45deg)' : 'none')
                          : bar === 1 ? (menuOpen ? 'scaleX(0)' : 'none')
                          : (menuOpen ? 'translateY(-5px) rotate(-45deg)' : 'none'),
                        opacity: menuOpen && bar === 1 ? 0 : 1,
                      }}
                    />
                  ))}
                </button>

                <button
                  onClick={() => setSettingsOpen((v) => !v)}
                  aria-label="Open settings"
                  aria-expanded={settingsOpen}
                  aria-controls="main-settings-panel"
                  style={{
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: 9,
                    letterSpacing: '0.08em',
                    color: settingsOpen ? 'var(--color-bg)' : 'var(--color-primary)',
                    border: '1px solid var(--color-primary)',
                    background: settingsOpen ? 'var(--color-primary)' : 'transparent',
                    boxShadow: settingsOpen ? '0 0 12px var(--color-glow)' : 'none',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    borderRadius: isLiquidGlass ? 6 : 0,
                  }}
                >
                  ⚙ SET
                </button>
              </>
            ) : (
              /* Desktop: nav links + settings button */
              <>
                <nav aria-label="Main navigation" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {navLinks.map((link) => (
                    <a
                      key={link}
                      href={`#${link}`}
                      style={{
                        fontFamily: "'Roboto Mono', monospace",
                        color: 'var(--color-primary)',
                        textDecoration: 'none',
                        fontSize: 10,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        padding: '4px 7px',
                        border: '1px solid transparent',
                        transition: 'all 0.2s ease',
                        whiteSpace: 'nowrap',
                        borderRadius: isLiquidGlass ? 6 : 0,
                      }}
                      onMouseEnter={e => {
                        e.target.style.borderColor = 'var(--color-primary)';
                        if (!isMinimal) e.target.style.boxShadow = '0 0 8px var(--color-glow)';
                        if (isLiquidGlass) e.target.style.background = 'rgba(168,216,255,0.08)';
                      }}
                      onMouseLeave={e => {
                        e.target.style.borderColor = 'transparent';
                        e.target.style.boxShadow = 'none';
                        e.target.style.background = 'transparent';
                      }}
                    >
                      {link}
                    </a>
                  ))}
                </nav>

                <button
                  onClick={() => setSettingsOpen((v) => !v)}
                  aria-label="Open settings panel"
                  aria-expanded={settingsOpen}
                  aria-controls="main-settings-panel"
                  style={{
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: 9,
                    letterSpacing: '0.08em',
                    color: settingsOpen ? 'var(--color-bg)' : 'var(--color-primary)',
                    border: `1px solid ${settingsOpen ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    background: settingsOpen ? 'var(--color-primary)' : (isLiquidGlass ? 'rgba(168,216,255,0.08)' : 'var(--color-card)'),
                    padding: '5px 8px',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: settingsOpen ? '0 0 10px var(--color-glow)' : 'none',
                    borderRadius: isLiquidGlass ? 6 : 0,
                  }}
                >
                  ⚙ SET
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Mobile nav menu ── */}
        {isCompact && (
          <nav
            id="mobile-main-navigation"
            aria-label="Mobile navigation"
            aria-hidden={!menuOpen}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              width: '100%',
              border: menuOpen ? '1px solid var(--color-border)' : '1px solid transparent',
              background: isLiquidGlass
                ? 'rgba(6,12,24,0.82)'
                : 'var(--color-card)',
              backdropFilter: isLiquidGlass ? 'blur(24px)' : 'none',
              maxHeight: menuOpen ? 280 : 0,
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateY(0)' : 'translateY(-6px)',
              overflow: 'hidden',
              pointerEvents: menuOpen ? 'auto' : 'none',
              transition: 'max-height 0.32s cubic-bezier(0.22,1,0.36,1), opacity 0.22s ease, transform 0.28s cubic-bezier(0.22,1,0.36,1)',
              borderRadius: isLiquidGlass ? '0 0 12px 12px' : 0,
              marginTop: 4,
            }}
          >
            {navLinks.map((link, idx) => (
              <a
                key={link}
                href={`#${link}`}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: "'Roboto Mono', monospace",
                  color: 'var(--color-primary)',
                  textDecoration: 'none',
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '10px 14px',
                  borderBottom: '1px solid var(--color-border)',
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? 'translateX(0)' : 'translateX(-8px)',
                  transition: `opacity 0.26s ease ${idx * 45}ms, transform 0.32s cubic-bezier(0.22,1,0.36,1) ${idx * 45}ms`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span style={{ color: 'var(--color-text-dim)', fontSize: 9 }}>{String(idx + 1).padStart(2, '0')}.</span>
                {link}
              </a>
            ))}
          </nav>
        )}

        {/* ── Settings panel ── */}
        <div id="main-settings-panel">
          {renderSettingsPanel()}
        </div>
      </div>
    </header>
  );
}
