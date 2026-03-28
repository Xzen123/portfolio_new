import { useEffect, useState } from 'react';
import ProjectModal from './ProjectModal';

const PROJECTS_API_URL = 'http://localhost:5000/api/projects?username=Xzen123';

const FALLBACK_PROJECTS = [
  {
    name: 'PORTFOLIO_CORE.EXE',
    desc: 'Fallback project list loaded because live server data is currently unavailable.',
    fullDesc: 'This is a safety fallback entry shown when the projects API is down or unreachable. It keeps the projects section usable during backend outages.',
    features: [
      'Visible during API/server failure only',
      'Ensures projects section never renders empty',
      'Allows modal and card interactions to continue',
      'Helps maintain a stable portfolio UX',
    ],
    stack: ['React', 'Vite', 'Failover'],
    demo: 'https://github.com/Xzen123',
    repo: 'https://github.com/Xzen123',
    img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60',
  },
  {
    name: 'BUNK_CALCULATOR.EXE',
    desc: 'Attendance utility to estimate safe leaves and required classes.',
    fullDesc: 'Bunk Calculator helps students instantly decide safe leaves and class recovery plans. It is optimized for quick everyday usage.',
    features: [
      'Safe leave calculation',
      'Recovery class estimation',
      'Target percentage support',
      'Simple fast UI',
    ],
    stack: ['JavaScript', 'HTML', 'CSS'],
    demo: 'https://xzen123.github.io/Bunk-calculator',
    repo: 'https://github.com/Xzen123/Bunk-calculator',
    img: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&auto=format&fit=crop&q=60',
  },
  {
    name: 'SITE.EXE',
    desc: 'Minimal link hub and profile landing page project.',
    fullDesc: 'A lightweight and fast profile landing page with clean visual design and responsive behavior.',
    features: [
      'Responsive layout',
      'Clean profile links',
      'Fast static hosting',
      'Minimal dependencies',
    ],
    stack: ['HTML', 'CSS'],
    demo: 'https://xzen123.github.io/site/',
    repo: 'https://github.com/Xzen123/site',
    img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60',
  },
];

function ProjectCard({ project, onClick }) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      style={{
        background: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--color-primary)';
        e.currentTarget.style.boxShadow = '0 0 30px var(--color-glow)';
        e.currentTarget.style.transform = 'translateY(-6px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--color-border)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Title bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '6px 12px',
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 11, color: 'var(--color-primary)', letterSpacing: '0.05em' }}>
          {project.name}
        </span>
      </div>

      {/* Image */}
      <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '16/9' }}>
        <img
          src={project.img}
          alt={project.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.4) brightness(0.85)', transition: 'all 0.5s ease' }}
          onMouseEnter={e => { e.currentTarget.style.filter = 'grayscale(0) brightness(1)'; }}
          onMouseLeave={e => { e.currentTarget.style.filter = 'grayscale(0.4) brightness(0.85)'; }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--color-card), transparent)' }} />
        <div style={{
          position: 'absolute', top: 8, right: 8,
          fontFamily: "'Roboto Mono', monospace", fontSize: 9,
          color: 'var(--color-primary)',
          background: 'var(--color-card)',
          border: '1px solid var(--color-primary)',
          padding: '2px 6px', letterSpacing: '0.1em',
          opacity: 0.85,
        }}>↗ EXPAND</div>
      </div>

      {/* Body */}
      <div style={{ padding: 16 }}>
        <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 11, color: 'var(--color-secondary)', marginBottom: 8 }}>
          ┌─── DESCRIPTION ───┐
        </div>
        <p style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 12, color: 'var(--color-text-dim)', lineHeight: 1.6, margin: '0 0 12px' }}>
          {project.desc}
        </p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
          {project.stack.slice(0, 3).map((s) => (
            <span key={s} style={{
              fontFamily: "'Roboto Mono', monospace", fontSize: 10,
              color: 'var(--color-primary)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              padding: '2px 8px',
            }}>{s}</span>
          ))}
        </div>
        {/* Clickable action buttons on card */}
        <div style={{ display: 'flex', gap: 8 }}>
          <a
            href={project.demo}
            target="_blank"
            rel="noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              flex: 1, textAlign: 'center',
              fontFamily: "'Roboto Mono', monospace", fontSize: 10,
              color: 'var(--color-bg)',
              background: 'var(--color-primary)',
              border: '1px solid var(--color-primary)',
              padding: '7px 4px',
              textDecoration: 'none',
              letterSpacing: '0.06em',
              transition: 'all 0.2s ease',
              fontWeight: 700,
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            [DEMO]
          </a>
          <a
            href={project.repo}
            target="_blank"
            rel="noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              flex: 1, textAlign: 'center',
              fontFamily: "'Roboto Mono', monospace", fontSize: 10,
              color: 'var(--color-primary)',
              background: 'transparent',
              border: '1px solid var(--color-primary)',
              padding: '7px 4px',
              textDecoration: 'none',
              letterSpacing: '0.06em',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-bg)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-primary)'; }}
          >
            [GITHUB]
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sourceLabel, setSourceLabel] = useState('github');

  useEffect(() => {
    let isMounted = true;

    const loadProjects = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await fetch(PROJECTS_API_URL, { signal: AbortSignal.timeout(10000) });
        if (!res.ok) {
          throw new Error(`Projects API returned ${res.status}`);
        }

        const data = await res.json();
        if (!Array.isArray(data.projects)) {
          throw new Error('Invalid projects payload');
        }

        if (isMounted) {
          setProjects(data.projects);
          setSourceLabel(data.source || 'github');
        }
      } catch {
        if (isMounted) {
          setError('Unable to fetch projects from server. Showing fallback project list.');
          setProjects(FALLBACK_PROJECTS);
          setSourceLabel('fallback');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="projects" style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontFamily: "'Roboto Mono', monospace", color: 'var(--color-secondary)', fontWeight: 700, fontSize: 18 }}>$</span>
        <h2 style={{ fontFamily: "'Roboto Mono', monospace", color: 'var(--color-primary)', fontSize: 20, fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.1em', textShadow: '0 0 15px var(--color-glow)', margin: 0 }}>ls -la ./projects</h2>
      </div>
      <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 11, color: 'var(--color-text-dim)', marginBottom: 36, letterSpacing: '0.05em' }}>
        // {projects.length} repos · github.com/Xzen123 · source: {sourceLabel}
      </div>

      {loading && (
        <div style={{
          fontFamily: "'Roboto Mono', monospace",
          fontSize: 12,
          color: 'var(--color-text-dim)',
          marginBottom: 24,
          letterSpacing: '0.08em',
        }}>
          // Syncing projects from GitHub and Gemini...
        </div>
      )}

      {error && (
        <div style={{
          fontFamily: "'Roboto Mono', monospace",
          fontSize: 12,
          color: 'var(--color-secondary)',
          marginBottom: 24,
          letterSpacing: '0.05em',
        }}>
          // {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        {projects.map((p) => (
          <ProjectCard key={p.name} project={p} onClick={() => setSelectedProject(p)} />
        ))}
      </div>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </section>
  );
}
