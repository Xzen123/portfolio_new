import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import ProjectModal from './ProjectModal';

/* ─────────────────────────────────────────────
  6 hardcoded portfolio projects
───────────────────────────────────────────── */
const PROJECTS = [
  {
    name: 'BUNK_CALCULATOR',
    desc: 'Smart attendance utility to instantly calculate safe leaves and recovery classes for any target percentage.',
    fullDesc:
      'Bunk Calculator helps students instantly decide how many classes they can safely skip or need to attend to hit a target attendance percentage. Built for everyday usage, it\'s fast, reliable, and requires zero setup.',
    features: [
      'Safe leave calculation engine',
      'Recovery class estimator',
      'Custom attendance target support',
      'Instant results, zero dependencies',
    ],
    stack: ['JavaScript', 'HTML', 'CSS'],
    demo: 'https://xzen123.github.io/Bunk-calculator',
    repo: 'https://github.com/Xzen123/Bunk-calculator',
    img: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&auto=format&fit=crop&q=60',
    status: 'LIVE',
  },
  {
    name: 'CAMPUSPATH',
    desc: 'Campus navigation and resource discovery app built for college students using the MERN stack.',
    fullDesc:
      'CampusPath is a full-stack MERN application that helps students navigate campus facilities, discover resources, and connect with peers. Features include interactive maps, resource listings, and user authentication.',
    features: [
      'Interactive campus navigation',
      'Resource discovery & filtering',
      'User authentication with JWT',
      'Responsive mobile-first design',
    ],
    stack: ['React', 'Node.js', 'Express', 'MongoDB'],
    demo: 'https://github.com/Xzen123/CampusPath',
    repo: 'https://github.com/Xzen123/CampusPath',
    img: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=60',
    status: 'DEV',
  },
  {
    name: 'CITSCINET',
    desc: 'Citizen science platform enabling community-driven data collection and environmental research collaboration.',
    fullDesc:
      'CitSciNet is a platform that bridges academic researchers and citizen scientists. Users can participate in data collection campaigns, submit field observations, and contribute to real environmental research projects.',
    features: [
      'Campaign creation & management',
      'Field data submission & validation',
      'Community research dashboard',
      'REST API + JWT auth backend',
    ],
    stack: ['React', 'Express', 'MongoDB', 'Node.js'],
    demo: 'https://github.com/Xzen123/CitSciNet',
    repo: 'https://github.com/Xzen123/CitSciNet',
    img: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&auto=format&fit=crop&q=60',
    status: 'DEV',
  },
  {
    name: 'PORTFOLIO_V3',
    desc: 'This portfolio — a retro-terminal MERN app with multiple themes, CRT effects, and a polished design system.',
    fullDesc:
      'A full-stack MERN portfolio featuring a custom multi-theme system (Cyberpunk, Matrix, Dracula, Nord, Amber, Liquid Glass, Minimal), CRT overlay effects, animated loading screen, and responsive layout built with React + Vite.',
    features: [
      '7 switchable terminal themes',
      'CRT scanline overlay effect',
      'Animated loading + minimize screen',
      'Express backend with MongoDB',
    ],
    stack: ['React', 'Vite', 'Node.js', 'Express', 'MongoDB'],
    demo: 'https://portfolio-new-vzv1.onrender.com',
    repo: 'https://github.com/Xzen123/portfolio_new',
    img: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop&q=60',
    status: 'LIVE',
  },
  {
    name: 'SITE',
    desc: 'Minimal personal link hub and profile landing page. Clean, fast, and statically hosted.',
    fullDesc:
      'A lightweight profile landing page and link hub. Designed with a clean minimalist aesthetic, it loads instantly with zero JavaScript dependencies and is hosted via GitHub Pages.',
    features: [
      'Zero-JS static page',
      'Clean responsive layout',
      'Curated social & project links',
      'GitHub Pages deployment',
    ],
    stack: ['HTML', 'CSS'],
    demo: 'https://xzen123.github.io/site/',
    repo: 'https://github.com/Xzen123/site',
    img: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&auto=format&fit=crop&q=60',
    status: 'LIVE',
  },
  {
    name: 'DSA_VISUALIZER',
    desc: 'Interactive algorithm and data structure visualizer — step through sorting, DP, graphs, and more.',
    fullDesc:
      'An interactive web tool that visualizes classic DSA algorithms step by step. Built to help learners understand execution flow through animated demonstrations of sorting algorithms, dynamic programming tables, and graph traversals.',
    features: [
      'Sorting algorithms with step animation',
      'Dynamic programming table walkthrough',
      'Graph BFS / DFS traversal',
      'Speed & input controls',
    ],
    stack: ['JavaScript', 'HTML', 'CSS'],
    demo: 'https://github.com/Xzen123',
    repo: 'https://github.com/Xzen123',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60',
    status: 'WIP',
  },
];

const STATUS_COLORS = {
  LIVE: '#28C840',
  DEV: '#FFB300',
  WIP: '#888899',
};

function ProjectCard({ project, onClick, isLiquidGlass }) {
  const statusColor = STATUS_COLORS[project.status] || '#888899';

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      aria-label={`View details for ${project.name}`}
      style={{
        background: isLiquidGlass ? 'rgba(18,35,65,0.45)' : 'var(--color-card)',
        backdropFilter: isLiquidGlass ? 'blur(24px) saturate(160%)' : 'none',
        WebkitBackdropFilter: isLiquidGlass ? 'blur(24px) saturate(160%)' : 'none',
        border: '1px solid var(--color-border)',
        borderRadius: isLiquidGlass ? 16 : 0,
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--color-primary)';
        e.currentTarget.style.boxShadow = isLiquidGlass
          ? '0 8px 40px rgba(142,210,255,0.2), 0 0 0 1px rgba(168,216,255,0.15)'
          : '0 0 30px var(--color-glow)';
        e.currentTarget.style.transform = 'translateY(-5px)';
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
        padding: '8px 14px',
        background: isLiquidGlass ? 'rgba(168,216,255,0.06)' : 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <span style={{
          fontFamily: "'Roboto Mono', monospace",
          fontSize: 11,
          color: 'var(--color-primary)',
          letterSpacing: '0.05em',
          fontWeight: 600,
        }}>
          {project.name}
        </span>
        <span style={{
          fontFamily: "'Roboto Mono', monospace",
          fontSize: 9,
          color: statusColor,
          letterSpacing: '0.1em',
          border: `1px solid ${statusColor}`,
          padding: '1px 6px',
          borderRadius: isLiquidGlass ? 4 : 0,
          opacity: 0.85,
        }}>
          {project.status}
        </span>
      </div>

      {/* Image */}
      <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '16/9' }}>
        <img
          src={project.img}
          alt={project.name}
          loading="lazy"
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            filter: 'grayscale(0.35) brightness(0.82)',
            transition: 'filter 0.4s ease, transform 0.4s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.filter = 'grayscale(0) brightness(1)';
            e.currentTarget.style.transform = 'scale(1.04)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.filter = 'grayscale(0.35) brightness(0.82)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, var(--color-card) 0%, transparent 60%)',
        }} />
        <div style={{
          position: 'absolute', top: 8, right: 8,
          fontFamily: "'Roboto Mono', monospace", fontSize: 9,
          color: 'var(--color-primary)',
          background: isLiquidGlass ? 'rgba(6,12,24,0.7)' : 'var(--color-card)',
          border: '1px solid var(--color-primary)',
          padding: '2px 7px',
          letterSpacing: '0.1em',
          borderRadius: isLiquidGlass ? 4 : 0,
          opacity: 0.9,
          backdropFilter: isLiquidGlass ? 'blur(8px)' : 'none',
        }}>
          ↗ EXPAND
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <p style={{
          fontFamily: "'Roboto Mono', monospace",
          fontSize: 12,
          color: 'var(--color-text-dim)',
          lineHeight: 1.65,
          margin: '0 0 14px',
          flex: 1,
        }}>
          {project.desc}
        </p>

        {/* Stack tags */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
          {project.stack.slice(0, 4).map(s => (
            <span key={s} style={{
              fontFamily: "'Roboto Mono', monospace",
              fontSize: 9,
              color: 'var(--color-primary)',
              border: '1px solid var(--color-border)',
              background: isLiquidGlass ? 'rgba(168,216,255,0.06)' : 'var(--color-surface)',
              padding: '2px 7px',
              borderRadius: isLiquidGlass ? 4 : 0,
            }}>
              {s}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          <a
            href={project.demo}
            target="_blank"
            rel="noreferrer noopener"
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
              fontWeight: 700,
              transition: 'opacity 0.2s ease',
              borderRadius: isLiquidGlass ? 6 : 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
            aria-label={`View demo for ${project.name}`}
          >
            DEMO
          </a>
          <a
            href={project.repo}
            target="_blank"
            rel="noreferrer noopener"
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
              borderRadius: isLiquidGlass ? 6 : 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--color-primary)';
              e.currentTarget.style.color = 'var(--color-bg)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--color-primary)';
            }}
            aria-label={`View GitHub repo for ${project.name}`}
          >
            GITHUB
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const { currentTheme } = useTheme();
  const isLiquidGlass = currentTheme?.name === 'liquidglass';
  const [selectedProject, setSelectedProject] = useState(null);
  const [isCompact, setIsCompact] = useState(false);
  const [showAll, setShowAll] = useState(false);

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

  const visibleProjects = isCompact && !showAll ? PROJECTS.slice(0, 2) : PROJECTS;

  return (
    <section id="projects" style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{
          fontFamily: "'Roboto Mono', monospace",
          color: 'var(--color-secondary)', fontWeight: 700, fontSize: 18,
        }}>$</span>
        <h2 style={{
          fontFamily: "'Roboto Mono', monospace",
          color: 'var(--color-primary)',
          fontSize: 20, fontWeight: 400,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          textShadow: isLiquidGlass ? 'none' : '0 0 15px var(--color-glow)',
          margin: 0,
        }}>
          ls -la ./projects
        </h2>
      </div>
      <div style={{
        fontFamily: "'Roboto Mono', monospace",
        fontSize: 11,
        color: 'var(--color-text-dim)',
        marginBottom: 40,
        letterSpacing: '0.05em',
      }}>
        // {PROJECTS.length} projects · github.com/Xzen123 · locally cached
      </div>

      {/* Project grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 24,
      }}>
        {visibleProjects.map(p => (
          <ProjectCard
            key={p.name}
            project={p}
            onClick={() => setSelectedProject(p)}
            isLiquidGlass={isLiquidGlass}
          />
        ))}
      </div>

      {/* Mobile: show more */}
      {isCompact && PROJECTS.length > 2 && (
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => setShowAll(v => !v)}
            style={{
              fontFamily: "'Roboto Mono', monospace",
              fontSize: 10,
              letterSpacing: '0.08em',
              color: 'var(--color-primary)',
              border: '1px solid var(--color-primary)',
              background: 'transparent',
              padding: '9px 18px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              borderRadius: isLiquidGlass ? 8 : 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--color-primary)';
              e.currentTarget.style.color = 'var(--color-bg)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--color-primary)';
            }}
          >
            {showAll ? '↑ SHOW LESS' : `↓ SHOW ALL ${PROJECTS.length} PROJECTS`}
          </button>
        </div>
      )}

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </section>
  );
}
