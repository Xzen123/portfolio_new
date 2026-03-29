import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../config/api';

const STATUS_API_URL = API_ENDPOINTS.projectsStatus;

export default function Footer() {
  const [isCompact, setIsCompact] = useState(false);
  const [apiStatus, setApiStatus] = useState({
    github: { mode: 'fallback' },
    gemini: { mode: 'fallback' },
  });

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
    let isMounted = true;

    const fetchStatus = async () => {
      try {
        const res = await fetch(STATUS_API_URL, { signal: AbortSignal.timeout(5000) });
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && data?.github && data?.gemini) {
          setApiStatus(data);
        }
      } catch {
        if (isMounted) {
          setApiStatus({ github: { mode: 'fallback' }, gemini: { mode: 'fallback' } });
        }
      }
    };

    fetchStatus();
    const intervalId = setInterval(fetchStatus, 30000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const footerLinks = [
    { label: '[ GITHUB ]', href: 'https://github.com/Xzen123' },
    { label: '[ LINKEDIN ]', href: 'https://www.linkedin.com/in/alok-kumar-9958b1266/' },
    { label: '[ WHATSAPP ]', href: 'https://wa.me/919508397337' },
    { label: '[ 9508397337 ]', href: 'tel:9508397337' },
    { label: '[ EMAIL ]', href: 'mailto:alokcse03@gmail.com' },
  ];

  return (
    <footer style={{
      position: 'fixed',
      bottom: 0, left: 0, right: 0,
      minHeight: isCompact ? 86 : 56,
      display: 'flex',
      flexDirection: isCompact ? 'column' : 'row',
      justifyContent: isCompact ? 'center' : 'space-between',
      alignItems: isCompact ? 'stretch' : 'center',
      padding: isCompact ? '8px 14px 12px' : '6px 24px 8px',
      gap: isCompact ? 8 : 0,
      background: 'color-mix(in srgb, var(--color-surface) 95%, transparent)',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid var(--color-border)',
      zIndex: 90,
      fontFamily: "'Roboto Mono', monospace",
      fontSize: isCompact ? 9 : 10,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-primary)', justifyContent: isCompact ? 'center' : 'flex-start' }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-primary)', display: 'inline-block', boxShadow: '0 0 8px var(--color-glow)', animation: 'pulse 2s infinite' }} />
        ONLINE | UPTIME: 99.9% | LAST_UPDATED: 2026 | V3.0.0-MERN
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: isCompact ? 'center' : 'flex-end', gap: 6, color: 'var(--color-text-dim)', marginBottom: isCompact ? 0 : 2 }}>
        <div style={{
          fontFamily: "'Roboto Mono', monospace",
          fontSize: isCompact ? 8 : 9,
          letterSpacing: '0.08em',
          color: 'var(--color-text-dim)',
          textAlign: isCompact ? 'center' : 'right',
        }}>
          API_STATUS: GH[{apiStatus.github.mode.toUpperCase()}] | GM[{apiStatus.gemini.mode.toUpperCase()}]
        </div>

        <div style={{ display: 'flex', gap: isCompact ? 10 : 16, flexWrap: 'wrap', justifyContent: isCompact ? 'center' : 'flex-end' }}>
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--color-primary)'}
              onMouseLeave={e => e.target.style.color = 'var(--color-text-dim)'}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
