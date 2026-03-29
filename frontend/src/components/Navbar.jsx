import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useWindow } from '../context/WindowContext';

export default function Navbar() {
  const { currentTheme } = useTheme();
  const { minimize, toggleFullscreen, isFullscreen, crtEnabled, toggleCRT } = useWindow();
  const [scrolled, setScrolled] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const isMinimal = currentTheme?.minimal;

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

  const navLinks = ['about', 'skills', 'experience', 'projects', 'contact'];

  const dotStyle = (color, glowColor) => ({
    width: 14, height: 14, borderRadius: '50%',
    background: color, border: 'none', cursor: 'pointer',
    padding: 0, flexShrink: 0,
    boxShadow: isMinimal ? 'none' : `0 0 6px ${glowColor}`,
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  });

  const handleDotHover = (e, glow, enter) => {
    e.currentTarget.style.transform = enter ? 'scale(1.3)' : 'scale(1)';
    e.currentTarget.style.boxShadow = enter ? `0 0 12px ${glow}` : (isMinimal ? 'none' : `0 0 6px ${glow}`);
  };

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled
        ? 'color-mix(in srgb, var(--color-surface) 96%, transparent)'
        : (isMinimal ? 'var(--color-surface)' : 'rgba(0,0,0,0.6)'),
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: '1px solid var(--color-border)',
      boxShadow: scrolled && !isMinimal ? '0 4px 30px var(--color-glow)' : 'none',
      transition: 'all 0.3s ease',
    }}>
      <div style={{
        display: isCompact ? 'flex' : 'grid',
        flexDirection: isCompact ? 'column' : 'row',
        gridTemplateColumns: isCompact ? undefined : '200px 1fr 200px',
        alignItems: 'center',
        minHeight: isCompact ? 92 : 56,
        padding: isCompact ? '8px 12px 10px' : '0 20px',
        maxWidth: 1400,
        margin: '0 auto',
        gap: isCompact ? 8 : 12,
      }}>

        {/* LEFT: Window controls + CRT toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: isCompact ? 'center' : 'flex-start', width: isCompact ? '100%' : 'auto' }}>
          {/* Red – Minimize */}
          <button
            title="Minimize (dock)"
            onClick={minimize}
            style={dotStyle('#FF5F57', 'rgba(255,95,87,0.6)')}
            onMouseEnter={e => handleDotHover(e, 'rgba(255,95,87,0.9)', true)}
            onMouseLeave={e => handleDotHover(e, 'rgba(255,95,87,0.6)', false)}
          />
          {/* Yellow – CRT toggle */}
          <button
            title={crtEnabled ? 'Disable CRT' : 'Enable CRT'}
            onClick={toggleCRT}
            style={{ ...dotStyle('#FFBD2E', 'rgba(255,189,46,0.6)'), opacity: crtEnabled ? 1 : 0.45 }}
            onMouseEnter={e => handleDotHover(e, 'rgba(255,189,46,0.9)', true)}
            onMouseLeave={e => handleDotHover(e, 'rgba(255,189,46,0.6)', false)}
          />
          {/* Green – Fullscreen */}
          <button
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            onClick={() => {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen({ navigationUI: 'hide' }).catch(() => {});
              } else {
                document.exitFullscreen().catch(() => {});
              }
            }}
            style={dotStyle('#28C840', 'rgba(40,200,64,0.6)')}
            onMouseEnter={e => handleDotHover(e, 'rgba(40,200,64,0.9)', true)}
            onMouseLeave={e => handleDotHover(e, 'rgba(40,200,64,0.6)', false)}
          />

          {/* CRT label pill */}
          {!isMinimal && (
            <span
              onClick={toggleCRT}
              style={{
                fontFamily: "'Roboto Mono', monospace",
                fontSize: 9,
                letterSpacing: '0.1em',
                color: crtEnabled ? 'var(--color-primary)' : 'var(--color-text-dim)',
                border: `1px solid ${crtEnabled ? 'var(--color-primary)' : 'var(--color-border)'}`,
                padding: '2px 7px',
                cursor: 'pointer',
                userSelect: 'none',
                transition: 'all 0.2s',
                boxShadow: crtEnabled ? '0 0 6px var(--color-glow)' : 'none',
              }}
            >
              CRT {crtEnabled ? 'ON' : 'OFF'}
            </span>
          )}
        </div>

        {/* CENTER: Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', width: isCompact ? '100%' : 'auto' }}>
          <a href="#" style={{
            fontFamily: "'Roboto Mono', monospace",
            color: 'var(--color-primary)',
            fontWeight: 700, fontSize: isCompact ? 12 : 13,
            letterSpacing: '0.08em',
            textDecoration: 'none',
            textShadow: isMinimal ? 'none' : '0 0 12px var(--color-glow)',
            whiteSpace: 'nowrap',
          }}>
            alok@portfolio:~$
          </a>
        </div>

        {/* RIGHT: Nav links */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCompact ? 'flex-start' : 'flex-end',
          gap: 2,
          flexWrap: 'nowrap',
          width: isCompact ? '100%' : 'auto',
          overflowX: isCompact ? 'auto' : 'visible',
          paddingBottom: isCompact ? 2 : 0,
        }}>
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link}`}
              style={{
                fontFamily: "'Roboto Mono', monospace",
                color: 'var(--color-primary)',
                textDecoration: 'none',
                fontSize: isCompact ? 9 : 10,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: isCompact ? '4px 6px' : '4px 7px',
                border: '1px solid transparent',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                e.target.style.borderColor = 'var(--color-primary)';
                if (!isMinimal) e.target.style.boxShadow = '0 0 8px var(--color-glow)';
              }}
              onMouseLeave={e => {
                e.target.style.borderColor = 'transparent';
                e.target.style.boxShadow = 'none';
              }}
            >
              [{link}]
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
