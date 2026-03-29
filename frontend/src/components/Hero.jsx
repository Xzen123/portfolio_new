import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const ASCII_ALOK = `
 █████  ██       ██████  ██   ██ 
██   ██ ██      ██    ██ ██  ██  
███████ ██      ██    ██ █████   
██   ██ ██      ██    ██ ██  ██  
██   ██ ███████  ██████  ██   ██ `;

const TYPING_PHRASES = [
  'Full Stack Developer',
  'Problem Solver',
  'Open Source Contributor',
  'UI Craftsman',
  'Terminal Enthusiast',
];

const PROFILE_LINKS = {
  resume: 'https://drive.google.com/file/d/18B0hr3oMRD2w-ceqtS62Bai0h8VTaSjl/view?usp=sharing',
};

export default function Hero() {
  const [displayed, setDisplayed] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const { currentTheme } = useTheme();
  const isMinimal = currentTheme?.minimal;
  const isLiquidGlass = currentTheme?.name === 'liquidglass';

  useEffect(() => {
    const phrase = TYPING_PHRASES[phraseIdx];
    let timeout;
    if (!deleting && displayed.length < phrase.length) {
      timeout = setTimeout(() => setDisplayed(phrase.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === phrase.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setPhraseIdx(i => (i + 1) % TYPING_PHRASES.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, phraseIdx]);

  return (
    <section
      id="hero"
      aria-label="Introduction"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px 40px',
        position: 'relative',
      }}
    >
      {/* Liquid glass ambient glow */}
      {isLiquidGlass && (
        <>
          <div style={{
            position: 'absolute', top: '15%', left: '20%',
            width: 430, height: 430,
            background: 'radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(198,225,255,0.22) 44%, transparent 72%)',
            pointerEvents: 'none',
            filter: 'blur(70px)',
          }} />
          <div style={{
            position: 'absolute', top: '40%', right: '15%',
            width: 360, height: 360,
            background: 'radial-gradient(circle, rgba(230,222,255,0.5) 0%, rgba(204,223,255,0.2) 48%, transparent 76%)',
            pointerEvents: 'none',
            filter: 'blur(70px)',
          }} />
        </>
      )}

      <div style={{
        width: '100%',
        maxWidth: 760,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
        borderRadius: isLiquidGlass ? 34 : 0,
        padding: isLiquidGlass ? '26px 18px' : 0,
        background: isLiquidGlass
          ? 'linear-gradient(150deg, rgba(255,255,255,0.86) 0%, rgba(236,245,255,0.56) 40%, rgba(224,236,255,0.44) 100%)'
          : 'transparent',
        border: isLiquidGlass ? '1px solid rgba(160,186,219,0.5)' : 'none',
        boxShadow: isLiquidGlass
          ? '0 30px 62px rgba(92, 123, 165, 0.26), inset 0 1px 0 rgba(255,255,255,0.92), inset 0 -1px 0 rgba(182,205,237,0.56)'
          : 'none',
        backdropFilter: isLiquidGlass ? 'blur(38px) saturate(190%)' : 'none',
        WebkitBackdropFilter: isLiquidGlass ? 'blur(38px) saturate(190%)' : 'none',
      }}>
        {isLiquidGlass && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 34,
              pointerEvents: 'none',
              background: 'linear-gradient(176deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.38) 20%, rgba(255,255,255,0.08) 42%, rgba(255,255,255,0) 68%)',
              mixBlendMode: 'screen',
            }}
          />
        )}

        {/* ASCII Art */}
        <pre
          aria-hidden="true"
          style={{
            fontFamily: "'Roboto Mono', monospace",
            color: 'var(--color-primary)',
            fontSize: 'clamp(8px, 1.6vw, 15px)',
            lineHeight: 1.15,
            margin: '0 0 32px',
            textShadow: (isMinimal || isLiquidGlass) ? 'none' : '0 0 20px var(--color-glow)',
            whiteSpace: 'pre',
            overflow: 'hidden',
            display: 'inline-block',
            textAlign: 'left',
            opacity: isLiquidGlass ? 0.9 : 1,
          }}
        >
          {ASCII_ALOK}
        </pre>

        {/* Typing Headline */}
        <h1 style={{
          fontFamily: "'Roboto Mono', monospace",
          color: 'var(--color-primary)',
          fontSize: 'clamp(20px, 4vw, 36px)',
          fontWeight: 400,
          margin: '0 0 20px',
          textShadow: (isMinimal || isLiquidGlass) ? 'none' : '0 0 15px var(--color-glow)',
          lineHeight: 1.3,
        }}>
          <span style={{ color: 'var(--color-secondary)' }}>&gt; </span>
          {displayed}
          <span className="blinking-cursor" aria-hidden="true">█</span>
        </h1>

        {/* Tagline */}
        <p style={{
          fontFamily: "'Roboto Mono', monospace",
          color: 'var(--color-text-dim)',
          fontSize: 13,
          lineHeight: 1.8,
          maxWidth: 540,
          margin: '0 0 40px',
          textAlign: 'center',
        }}>
          Building scalable full-stack applications,
          crafting elegant UIs, and writing code that doesn&apos;t just work — it performs.
        </p>

        {/* CTA Buttons */}
        <div style={{
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <a
            href="#contact"
            style={{
              fontFamily: "'Roboto Mono', monospace",
              background: 'var(--color-primary)',
              color: 'var(--color-bg)',
              padding: '13px 32px',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              border: '1px solid var(--color-primary)',
              boxShadow: (isMinimal || isLiquidGlass) ? 'none' : '0 0 20px var(--color-glow)',
              transition: 'all 0.2s ease',
              display: 'inline-block',
              whiteSpace: 'nowrap',
              borderRadius: isLiquidGlass ? 8 : 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = isLiquidGlass
                ? '0 8px 30px rgba(142,210,255,0.3)'
                : '0 0 40px var(--color-glow)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = (isMinimal || isLiquidGlass) ? 'none' : '0 0 20px var(--color-glow)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            CONTACT ME
          </a>

          <a
            href="#about"
            style={{
              fontFamily: "'Roboto Mono', monospace",
              background: 'transparent',
              color: 'var(--color-secondary)',
              padding: '13px 32px',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              border: '1px solid var(--color-secondary)',
              transition: 'all 0.2s ease',
              display: 'inline-block',
              whiteSpace: 'nowrap',
              borderRadius: isLiquidGlass ? 8 : 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = '0 0 20px var(--color-glow-secondary)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            ABOUT ME
          </a>

          <a
            href={PROFILE_LINKS.resume}
            target="_blank"
            rel="noreferrer noopener"
            style={{
              fontFamily: "'Roboto Mono', monospace",
              background: 'transparent',
              color: 'var(--color-primary)',
              padding: '13px 32px',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              border: '1px solid var(--color-primary)',
              transition: 'all 0.2s ease',
              display: 'inline-block',
              whiteSpace: 'nowrap',
              borderRadius: isLiquidGlass ? 8 : 0,
              opacity: 0.75,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = '0 0 20px var(--color-glow)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.opacity = '1';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.opacity = '0.75';
            }}
          >
            RESUME ↗
          </a>
        </div>

        {/* Scroll hint */}
        <div style={{
          marginTop: 64,
          fontFamily: "'Roboto Mono', monospace",
          fontSize: 11,
          color: 'var(--color-text-dim)',
          letterSpacing: '0.2em',
          animation: 'fadeUpDown 2s ease-in-out infinite',
        }}>
          ↓ SCROLL TO EXPLORE
        </div>
      </div>
    </section>
  );
}
