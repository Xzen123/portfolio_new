import { useTheme } from '../context/ThemeContext';
import './ProjectModal.css';

export default function ProjectModal({ project, onClose }) {
  const { currentTheme } = useTheme();
  const isMinimal = currentTheme?.minimal;

  // Close on Escape key
  const handleKey = (e) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} onKeyDown={handleKey}>
      <div
        className={`modal-window ${isMinimal ? 'minimal' : ''}`}
        onClick={e => e.stopPropagation()}
        style={{
          borderColor: 'var(--color-primary)',
          boxShadow: isMinimal
            ? '0 20px 60px rgba(0,0,0,0.3)'
            : '0 0 60px var(--color-glow), 0 0 120px color-mix(in srgb, var(--color-glow) 30%, transparent)',
        }}
      >
        {/* Title Bar */}
        <div className="modal-titlebar" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>

          <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 12, color: 'var(--color-primary)', letterSpacing: '0.05em' }}>
            {project.name}
          </span>
          <button className="modal-close" onClick={onClose} style={{ color: 'var(--color-text-dim)' }}>✕</button>
        </div>

        {/* Hero Image */}
        <div className="modal-hero">
          <img src={project.img} alt={project.name} />
          <div className="modal-hero-overlay" style={{ background: `linear-gradient(to top, var(--color-card), transparent 40%)` }} />
          <div className="modal-hero-badge" style={{ color: 'var(--color-primary)', borderColor: 'var(--color-primary)', background: 'var(--color-card)' }}>
            ┌─── {project.name} ───┐
          </div>
        </div>

        {/* Content */}
        <div className="modal-content" style={{ background: 'var(--color-card)' }}>
          <p style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 14, color: 'var(--color-text)', lineHeight: 1.7, marginBottom: 20 }}>
            {project.fullDesc || project.desc}
          </p>

          {/* Features */}
          {project.features && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 11, color: 'var(--color-secondary)', letterSpacing: '0.15em', marginBottom: 10 }}>
                $ ls -la ./features
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {project.features.map((f, i) => (
                  <li key={i} style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 12, color: 'var(--color-text-dim)', padding: '4px 0', display: 'flex', gap: 8 }}>
                    <span style={{ color: 'var(--color-primary)' }}>▸</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Stack */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 11, color: 'var(--color-secondary)', letterSpacing: '0.15em', marginBottom: 10 }}>
              $ cat stack.json
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {project.stack.map((s) => (
                <span key={s} style={{
                  fontFamily: "'Roboto Mono', monospace", fontSize: 12,
                  color: 'var(--color-primary)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  padding: '4px 12px',
                }}>{s}</span>
              ))}
            </div>
          </div>

          {/* Action Buttons — functional */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              style={{
                fontFamily: "'Roboto Mono', monospace", fontSize: 12, fontWeight: 700,
                color: 'var(--color-bg)',
                background: 'var(--color-primary)',
                border: '1px solid var(--color-primary)',
                padding: '11px 24px', textDecoration: 'none',
                letterSpacing: '0.1em',
                boxShadow: isMinimal ? 'none' : '0 0 20px var(--color-glow)',
                transition: 'all 0.2s ease',
                display: 'inline-block',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              ↗ LIVE_DEMO
            </a>
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer"
              style={{
                fontFamily: "'Roboto Mono', monospace", fontSize: 12, fontWeight: 700,
                color: 'var(--color-primary)',
                background: 'transparent',
                border: '1px solid var(--color-primary)',
                padding: '11px 24px', textDecoration: 'none',
                letterSpacing: '0.1em',
                transition: 'all 0.2s ease',
                display: 'inline-block',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-bg)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-primary)'; }}
            >
              ⌥ SOURCE_CODE
            </a>
            <button
              onClick={onClose}
              style={{
                fontFamily: "'Roboto Mono', monospace", fontSize: 12,
                color: 'var(--color-text-dim)',
                background: 'transparent',
                border: '1px solid var(--color-border)',
                padding: '11px 20px',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                marginLeft: 'auto',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-dim)'; }}
            >
              ✕ CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
