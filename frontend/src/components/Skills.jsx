import { useEffect, useRef, useState } from 'react';

const skills = [
  { category: 'FRONTEND', items: ['React', 'Next.js', 'TypeScript', 'HTML/CSS'], level: 95 },
  { category: 'BACKEND', items: ['Node.js', 'Express', 'Python', 'FastAPI'], level: 88 },
  { category: 'DATABASE', items: ['MongoDB', 'PostgreSQL', 'Redis', 'MySQL'], level: 82 },
  { category: 'DEVOPS', items: ['Docker', 'AWS', 'Terraform', 'CI/CD'], level: 75 },
  { category: 'LANGUAGES', items: ['JavaScript', 'TypeScript', 'Python', 'Go'], level: 90 },
  { category: 'SECURITY', items: ['OAuth2', 'JWT', 'AES-256', 'Pen-testing'], level: 70 },
];

function SkillBar({ skill, inView }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontFamily: "'Roboto Mono', monospace", fontSize: 11,
        color: 'var(--color-text-dim)', marginBottom: 6, letterSpacing: '0.1em',
      }}>
        <span>{skill.category}</span>
        <span style={{ color: 'var(--color-primary)' }}>{skill.level}%</span>
      </div>
      {/* Block bar */}
      <div style={{
        fontFamily: "'Roboto Mono', monospace", fontSize: 10,
        color: 'var(--color-primary)', letterSpacing: 1,
        textShadow: '0 0 8px var(--color-glow)',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }}>
        {inView && '█'.repeat(Math.round(skill.level / 3.33)) + '░'.repeat(30 - Math.round(skill.level / 3.33))}
      </div>
      {/* Tags */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
        {skill.items.map((item) => (
          <span key={item} style={{
            fontFamily: "'Roboto Mono', monospace", fontSize: 10,
            color: 'var(--color-secondary)',
            border: '1px solid var(--color-border)',
            padding: '2px 7px',
            background: 'var(--color-card)',
          }}>{item}</span>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="skills" style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }} ref={ref}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40 }}>
        <span style={{ fontFamily: "'Roboto Mono', monospace", color: 'var(--color-secondary)', fontWeight: 700, fontSize: 18 }}>$</span>
        <h2 style={{ fontFamily: "'Roboto Mono', monospace", color: 'var(--color-primary)', fontSize: 20, fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.1em', textShadow: '0 0 15px var(--color-glow)', margin: 0 }}>cat skills.json</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 32 }}>
        {/* Skill Bars */}
        <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', padding: 28 }}>
          <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 11, color: 'var(--color-primary)', letterSpacing: '0.2em', marginBottom: 20, textDecoration: 'underline' }}>CORE_CAPABILITIES</div>
          {skills.map((skill) => <SkillBar key={skill.category} skill={skill} inView={inView} />)}
        </div>

        {/* JSON Block */}
        <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', padding: 28 }}>
          <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 11, color: 'var(--color-primary)', letterSpacing: '0.2em', marginBottom: 20, textDecoration: 'underline' }}>TECH_STACK.JSON</div>
          <pre style={{
            fontFamily: "'Roboto Mono', monospace",
            fontSize: 12,
            lineHeight: 1.7,
            color: 'var(--color-text-dim)',
            margin: 0,
            whiteSpace: 'pre-wrap',
          }}>
{`{
  `}<span style={{ color: 'var(--color-primary)' }}>"frontend"</span>{`: [
    `}<span style={{ color: 'var(--color-secondary)' }}>"React"</span>{`,
    `}<span style={{ color: 'var(--color-secondary)' }}>"Vite"</span>{`,
    `}<span style={{ color: 'var(--color-secondary)' }}>"JavaScript"</span>{`,
    `}<span style={{ color: 'var(--color-secondary)' }}>"CSS3"</span>{`
  ],
  `}<span style={{ color: 'var(--color-primary)' }}>"backend"</span>{`: [
    `}<span style={{ color: 'var(--color-secondary)' }}>"Node.js"</span>{`,
    `}<span style={{ color: 'var(--color-secondary)' }}>"Express.js"</span>{`,
    `}<span style={{ color: 'var(--color-secondary)' }}>"REST APIs"</span>{`,
    `}<span style={{ color: 'var(--color-secondary)' }}>"Nodemailer"</span>{`
  ],
  `}<span style={{ color: 'var(--color-primary)' }}>"database"</span>{`: [
    `}<span style={{ color: 'var(--color-secondary)' }}>"MongoDB"</span>{`,
    `}<span style={{ color: 'var(--color-secondary)' }}>"Mongoose"</span>{`
  ],
  `}<span style={{ color: 'var(--color-primary)' }}>"integrations"</span>{`: [
    `}<span style={{ color: 'var(--color-secondary)' }}>"Contact API"</span>{`,
    `}<span style={{ color: 'var(--color-secondary)' }}>"Webhooks"</span>{`,
    `}<span style={{ color: 'var(--color-secondary)' }}>"SMTP"</span>{`
  ],
  `}<span style={{ color: 'var(--color-primary)' }}>"deploy"</span>{`: [
    `}<span style={{ color: 'var(--color-secondary)' }}>"Vercel"</span>{`,
    `}<span style={{ color: 'var(--color-secondary)' }}>"Render"</span>{`
  ],
  `}<span style={{ color: 'var(--color-primary)' }}>"status"</span>{`: `}<span style={{ color: 'var(--color-secondary)' }}>"BUILDING_REAL_PROJECTS"</span>{`,
  `}<span style={{ color: 'var(--color-primary)' }}>"uptime"</span>{`: `}<span style={{ color: 'var(--color-secondary)' }}>"99.9%"</span>{`
}`}
          </pre>
        </div>
      </div>
    </section>
  );
}
