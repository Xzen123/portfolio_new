export default function Footer() {
  return (
    <footer style={{
      position: 'fixed',
      bottom: 0, left: 0, right: 0,
      height: 44,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 24px',
      background: 'color-mix(in srgb, var(--color-surface) 95%, transparent)',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid var(--color-border)',
      zIndex: 90,
      fontFamily: "'Roboto Mono', monospace",
      fontSize: 10,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-primary)' }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-primary)', display: 'inline-block', boxShadow: '0 0 8px var(--color-glow)', animation: 'pulse 2s infinite' }} />
        ONLINE | UPTIME: 99.9% | LAST_UPDATED: 2025 | V3.0.0-MERN
      </div>
      <div style={{ display: 'flex', gap: 16, color: 'var(--color-text-dim)' }}>
        <a href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseEnter={e => e.target.style.color = 'var(--color-primary)'}
          onMouseLeave={e => e.target.style.color = 'var(--color-text-dim)'}
        >[ TERMINAL_LOG ]</a>
        <a href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseEnter={e => e.target.style.color = 'var(--color-primary)'}
          onMouseLeave={e => e.target.style.color = 'var(--color-text-dim)'}
        >[ SYSTEM_INFO ]</a>
      </div>
    </footer>
  );
}
