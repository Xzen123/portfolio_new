import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const FOOTER_LINKS = [
  { label: 'GITHUB', href: 'https://github.com/Xzen123', icon: '⌥' },
  { label: 'LINKEDIN', href: 'https://www.linkedin.com/in/alok-kumar-9958b1266/', icon: '⊛' },
  { label: 'WHATSAPP', href: 'https://wa.me/919508397337', icon: '⊕' },
  { label: 'PHONE', href: 'tel:9508397337', icon: '⊙' },
  { label: 'EMAIL', href: 'mailto:alokcse03@gmail.com', icon: '✉' },
];

export default function Footer() {
  const { currentTheme } = useTheme();
  const isLiquidGlass = currentTheme?.name === 'liquidglass';

  const [isCompact, setIsCompact] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

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

  return (
    <footer
      id="footer"
      role="contentinfo"
      style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        minHeight: collapsed ? 28 : (isCompact ? 80 : 52),
        display: 'flex',
        flexDirection: collapsed ? 'row' : (isCompact ? 'column' : 'row'),
        justifyContent: collapsed ? 'space-between' : (isCompact ? 'center' : 'space-between'),
        alignItems: collapsed ? 'center' : (isCompact ? 'stretch' : 'center'),
        padding: collapsed ? '4px 14px' : (isCompact ? '8px 14px 10px' : '6px 24px 8px'),
        gap: collapsed ? 0 : (isCompact ? 7 : 0),
        background: isLiquidGlass
          ? 'linear-gradient(170deg, rgba(255,255,255,0.18) 0%, rgba(202,226,255,0.08) 45%, rgba(160,184,233,0.08) 100%)'
          : 'color-mix(in srgb, var(--color-surface) 95%, transparent)',
        backdropFilter: isLiquidGlass ? 'blur(24px) saturate(180%)' : 'blur(16px) saturate(150%)',
        WebkitBackdropFilter: isLiquidGlass ? 'blur(24px) saturate(180%)' : 'blur(16px) saturate(150%)',
        borderTop: `1px solid ${isLiquidGlass ? 'rgba(224,245,255,0.34)' : 'var(--color-border)'}`,
        boxShadow: isLiquidGlass
          ? '0 -18px 42px rgba(2, 10, 28, 0.4), inset 0 1px 0 rgba(255,255,255,0.28)'
          : 'none',
        zIndex: 90,
        fontFamily: "'Roboto Mono', monospace",
        fontSize: isCompact ? 9 : 10,
        letterSpacing: '0.1em',
        transition: 'min-height 0.28s ease, padding 0.28s ease',
      }}
    >
      {/* Status indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        color: 'var(--color-primary)',
        justifyContent: 'flex-start',
        whiteSpace: 'nowrap',
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: 'var(--color-primary)',
          display: 'inline-block',
          boxShadow: '0 0 6px var(--color-glow)',
          animation: 'pulse 2s infinite',
          flexShrink: 0,
        }} />
        {collapsed
          ? 'ALOK.DEV'
          : 'ONLINE · V3.0.0 · LAST_UPDATED: 2026'}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(v => !v)}
        aria-label={collapsed ? 'Expand footer' : 'Collapse footer'}
        aria-expanded={!collapsed}
        style={{
          fontFamily: "'Roboto Mono', monospace",
          fontSize: 9,
          letterSpacing: '0.08em',
          color: collapsed ? 'var(--color-bg)' : 'var(--color-primary)',
          border: '1px solid var(--color-primary)',
          background: collapsed
            ? (isLiquidGlass ? 'linear-gradient(180deg, rgba(230,246,255,0.94), rgba(197,223,255,0.86))' : 'var(--color-primary)')
            : (isLiquidGlass ? 'linear-gradient(155deg, rgba(255,255,255,0.18), rgba(196,223,255,0.08))' : 'transparent'),
          padding: '3px 8px',
          cursor: 'pointer',
          boxShadow: collapsed
            ? (isLiquidGlass ? '0 12px 26px rgba(2, 10, 28, 0.36), inset 0 1px 0 rgba(255,255,255,0.42)' : '0 0 8px var(--color-glow)')
            : (isLiquidGlass ? 'inset 0 1px 0 rgba(255,255,255,0.2)' : 'none'),
          transition: 'all 0.25s ease',
          borderRadius: isLiquidGlass ? 4 : 0,
          flexShrink: 0,
        }}
      >
        {collapsed ? '▲ EXPAND' : '▼ PEEK'}
      </button>

      {/* Links section */}
      <div style={{
        display: 'flex',
        flexDirection: isCompact ? 'row' : 'row',
        alignItems: 'center',
        justifyContent: isCompact ? 'center' : 'flex-end',
        gap: isCompact ? 12 : 18,
        maxHeight: collapsed ? 0 : 80,
        opacity: collapsed ? 0 : 1,
        overflow: 'hidden',
        pointerEvents: collapsed ? 'none' : 'auto',
        transition: 'max-height 0.26s ease, opacity 0.2s ease',
        flexWrap: 'wrap',
      }}>
        {FOOTER_LINKS.map(link => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={link.label}
            style={{
              color: 'var(--color-text-dim)',
              textDecoration: 'none',
              fontSize: isCompact ? 9 : 10,
              letterSpacing: '0.08em',
              transition: 'color 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-dim)')}
          >
            <span aria-hidden="true" style={{ fontSize: 10 }}>{link.icon}</span>
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
