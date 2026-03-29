import { useEffect, useState } from 'react';

const experiences = [
  {
    period: '2025-01 -> PRESENT',
    level: 'INFO',
    role: 'Full Stack Developer',
    company: 'Freelance / Personal Projects',
    desc: 'Building and shipping full stack products with a focus on clean UX and practical problem-solving.',
    stack: ['React', 'Vite', 'Node.js', 'Express', 'MongoDB'],
  },
  {
    period: '2024-08 -> PRESENT',
    level: 'INFO',
    role: 'CSE Undergraduate Engineer',
    company: 'NIT Patna',
    desc: 'Pursuing core CS while building practical products across web and backend systems.',
    stack: ['DSA', 'OOP', 'DBMS', 'Operating Systems'],
  },
  {
    period: '2024-08 -> 2025-03',
    level: 'INFO',
    role: 'Open Source Contributor',
    company: 'GitHub Community',
    desc: 'Contributed to open source repositories and maintained personal tools for productivity and automation.',
    stack: ['JavaScript', 'Python', 'Git', 'REST APIs'],
  },
  {
    period: '2023-01 -> 2024-07',
    level: 'DEBUG',
    role: 'Independent Project Developer',
    company: 'Self-Directed Learning',
    desc: 'Built foundational projects and sharpened development skills before joining NIT Patna.',
    stack: ['JavaScript', 'React', 'Node.js', 'Problem Solving'],
  },
];

const levelColors = {
  INFO: 'var(--color-primary)',
  DEBUG: 'var(--color-secondary)',
  VERBOSE: 'var(--color-text-dim)',
};

export default function Experience() {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)');
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
    <section id="experience" style={{ padding: isCompact ? '64px 16px' : '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: isCompact ? 28 : 40 }}>
        <span style={{ fontFamily: "'Roboto Mono', monospace", color: 'var(--color-secondary)', fontWeight: 700, fontSize: 18 }}>$</span>
        <h2 style={{ fontFamily: "'Roboto Mono', monospace", color: 'var(--color-primary)', fontSize: isCompact ? 16 : 20, fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.1em', textShadow: '0 0 15px var(--color-glow)', margin: 0 }}>tail -f experience.log</h2>
      </div>

      <div style={{
        background: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        padding: isCompact ? '20px 16px 8px' : '28px 28px 12px',
        boxShadow: '0 0 20px var(--color-glow)',
      }}>
        {experiences.map((exp, i) => (
          <div key={i} style={{ display: 'flex', gap: isCompact ? 10 : 16, marginBottom: isCompact ? 20 : 28 }}>
            {/* Timeline line */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                background: levelColors[exp.level],
                boxShadow: `0 0 10px ${levelColors[exp.level]}`,
                flexShrink: 0, marginTop: 4,
              }} />
              {i < experiences.length - 1 && (
                <div style={{ flex: 1, width: 1, background: 'var(--color-border)', marginTop: 4 }} />
              )}
            </div>

            {/* Content */}
            <div style={{ flex: 1, paddingBottom: 12 }}>
              <div style={{
                fontFamily: "'Roboto Mono', monospace",
                fontSize: isCompact ? 11 : 12,
                display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center',
                marginBottom: 8,
              }}>
                <span style={{ color: 'var(--color-text-dim)' }}>[{exp.period}]</span>
                <span style={{
                  color: levelColors[exp.level],
                  border: `1px solid ${levelColors[exp.level]}`,
                  padding: '1px 6px', fontSize: 10, fontWeight: 700,
                }}>{exp.level}</span>
                <span style={{ color: 'var(--color-text)', fontWeight: 700 }}>
                  {exp.role} @ {exp.company}
                </span>
              </div>
              <div style={{
                fontFamily: "'Roboto Mono', monospace",
                fontSize: isCompact ? 11 : 12,
                color: 'var(--color-text-dim)',
                borderLeft: '2px solid var(--color-border)',
                paddingLeft: 12,
                marginBottom: 8,
              }}>
                {exp.desc}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {exp.stack.map((s) => (
                  <span key={s} style={{
                    fontFamily: "'Roboto Mono', monospace", fontSize: 10,
                    color: 'var(--color-secondary)',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    padding: '1px 7px',
                  }}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Blinking cursor */}
        <div style={{
          fontFamily: "'Roboto Mono', monospace",
          color: 'var(--color-primary)',
          fontSize: 14,
          paddingLeft: 26,
          marginBottom: 8,
        }}>
          <span className="blinking-cursor" />
        </div>
      </div>
    </section>
  );
}
