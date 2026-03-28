const experiences = [
  {
    period: '2023-01 → PRESENT',
    level: 'INFO',
    role: 'Senior Frontend Engineer',
    company: 'TechCorp',
    desc: 'Building scalable React apps for 2M+ users.',
    stack: ['React', 'TypeScript', 'Node.js', 'AWS'],
  },
  {
    period: '2021-06 → 2022-12',
    level: 'INFO',
    role: 'Full Stack Developer',
    company: 'StartupXYZ',
    desc: 'Led backend rewrite from monolith to microservices.',
    stack: ['Go', 'Docker', 'PostgreSQL', 'Redis'],
  },
  {
    period: '2020-01 → 2021-05',
    level: 'DEBUG',
    role: 'Junior Developer',
    company: 'Agency',
    desc: 'Frontend development, learned the ropes.',
    stack: ['JavaScript', 'HTML/CSS', 'PHP'],
  },
  {
    period: '2019-06 → 2019-12',
    level: 'VERBOSE',
    role: 'Intern',
    company: 'Local Startup',
    desc: 'Built internal tools and automated workflows.',
    stack: ['Python', 'Django', 'MySQL'],
  },
];

const levelColors = {
  INFO: 'var(--color-primary)',
  DEBUG: 'var(--color-secondary)',
  VERBOSE: 'var(--color-text-dim)',
};

export default function Experience() {
  return (
    <section id="experience" style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40 }}>
        <span style={{ fontFamily: "'Roboto Mono', monospace", color: 'var(--color-secondary)', fontWeight: 700, fontSize: 18 }}>$</span>
        <h2 style={{ fontFamily: "'Roboto Mono', monospace", color: 'var(--color-primary)', fontSize: 20, fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.1em', textShadow: '0 0 15px var(--color-glow)', margin: 0 }}>tail -f experience.log</h2>
      </div>

      <div style={{
        background: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        padding: '28px 28px 12px',
        boxShadow: '0 0 20px var(--color-glow)',
      }}>
        {experiences.map((exp, i) => (
          <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
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
                fontSize: 12,
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
                fontSize: 12,
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
