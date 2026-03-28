import { useState } from 'react';
import ProjectModal from './ProjectModal';

const projects = [
  {
    name: 'BUNK_CALCULATOR.EXE',
    desc: 'Smart attendance tracker for students to calculate exactly how many classes they can safely skip while maintaining target attendance.',
    fullDesc: 'Bunk Calculator is a student utility tool that eliminates the guesswork in attendance management. Enter your current attendance stats and target percentage, and the app instantly computes how many lectures you can safely miss — or how many consecutive classes you need to attend to recover. Built with vanilla JavaScript for maximum performance with zero overhead.',
    features: [
      'Instant calculation of safe-to-bunk and must-attend lectures',
      'Target attendance percentage customization (75%, 80%, etc.)',
      'Clean, responsive UI with real-time updates as you type',
      'Zero dependencies — pure vanilla JavaScript, HTML & CSS',
    ],
    stack: ['JavaScript', 'HTML5', 'CSS3'],
    demo: 'https://xzen123.github.io/Bunk-calculator',
    repo: 'https://github.com/Xzen123/Bunk-calculator',
    img: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&auto=format&fit=crop&q=60',
  },
  {
    name: 'CAMPUS_PATH.EXE',
    desc: 'A TypeScript-powered campus navigation and pathfinding application built for NIT Patna to help students navigate the campus efficiently.',
    fullDesc: 'CampusPath is an interactive campus map and navigation tool developed for NIT Patna. It leverages graph-based pathfinding algorithms to compute the shortest route between any two campus locations. Built with TypeScript for type safety, it features an interactive map interface with building annotations, amenity markers, and turn-by-turn route guidance.',
    features: [
      'Graph-based shortest-path algorithm (Dijkstra\'s implementation)',
      'Interactive campus map with annotated buildings and amenities',
      'Search by building name, department, or category',
      'TypeScript-powered codebase for robust type safety',
    ],
    stack: ['TypeScript', 'React', 'Graph Algorithms'],
    demo: 'https://github.com/Xzen123/CampusPath',
    repo: 'https://github.com/Xzen123/CampusPath',
    img: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=60',
  },
  {
    name: 'CITSCI_NET.EXE',
    desc: 'Citizen science social network platform for SSFC that connects researchers and volunteers to collaborate on environmental data collection projects.',
    fullDesc: 'CitSciNet_SSFC is a collaborative citizen science platform that bridges the gap between professional researchers and citizen volunteers. The platform enables project creation, participant enrollment, real-time data submission, and community discussions. Built for the Smart Solutions for Future Challenges (SSFC) competition, the project has attracted community forks and is actively maintained.',
    features: [
      'Project creation and volunteer enrollment workflow',
      'Real-time data submission portal for field participants',
      'Community discussion boards with threaded comments',
      'Role-based access (Researcher / Volunteer / Admin)',
    ],
    stack: ['JavaScript', 'Node.js', 'Express', 'MongoDB'],
    demo: 'https://github.com/Xzen123/CitSciNet_SSFC',
    repo: 'https://github.com/Xzen123/CitSciNet_SSFC',
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60',
  },
  {
    name: 'PDF_SCRAPPER.EXE',
    desc: 'Python-powered PDF scraping and extraction tool that intelligently parses academic and structured documents into clean, usable data.',
    fullDesc: 'pdf_scrapper_v01 is a Python utility for extracting structured content from PDF documents. It handles multi-column layouts, embedded tables, and academic paper formats — outputting clean JSON or CSV data ready for downstream processing. Designed primarily for extracting data from course materials, research papers, and academic syllabi at NIT Patna.',
    features: [
      'Multi-column PDF layout detection and linearization',
      'Table extraction with row/column structure preservation',
      'Academic document parsing (syllabus, papers, notes)',
      'JSON and CSV output formats for pipeline integration',
    ],
    stack: ['Python', 'PyMuPDF', 'pdfplumber', 'pandas'],
    demo: 'https://github.com/Xzen123/pdf_scrapper_v01',
    repo: 'https://github.com/Xzen123/pdf_scrapper_v01',
    img: 'https://images.unsplash.com/photo-1568209865332-a15790aed756?w=800&auto=format&fit=crop&q=60',
  },
  {
    name: 'LINK_SITE.EXE',
    desc: 'A minimal, blazing-fast Linktree clone built with pure CSS — a central hub to showcase all social profiles and important links in style.',
    fullDesc: 'Site is a clean, zero-JavaScript Linktree alternative built entirely with HTML and CSS. It features a glassmorphism-inspired card design, animated gradient backgrounds, smooth hover transitions, and a responsive layout that looks great on all devices. Zero build tools, zero dependencies — just drop it on any static host.',
    features: [
      'Zero JavaScript — pure HTML & CSS implementation',
      'Glassmorphism card design with backdrop blur',
      'Animated gradient background with CSS keyframes',
      'Responsive design — mobile-first layout',
    ],
    stack: ['HTML5', 'CSS3', 'CSS Animations'],
    demo: 'https://xzen123.github.io/site',
    repo: 'https://github.com/Xzen123/site',
    img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60',
  },
  {
    name: 'NITP_NOTES.EXE',
    desc: 'A curated open-source repository of NIT Patna CSE notes, PYQs, and syllabi for all semesters — 2 stars and used by batches.',
    fullDesc: 'NITP-CSE-1ST-SEM is a comprehensive open-source knowledge base for NIT Patna Computer Science students. It aggregates previous year questions (PYQs), handwritten notes, official syllabi, and reference materials across all subjects of the first year. This repository has grown to become a go-to resource for incoming batches, earning 2 stars and several contributions.',
    features: [
      'Complete PYQ archive for all first-semester CSE subjects',
      'Handwritten and typed notes organized by module',
      'Official NIT Patna syllabus documents included',
      'Open contributions welcome — growing community resource',
    ],
    stack: ['Markdown', 'PDF', 'Open Source'],
    demo: 'https://github.com/Xzen123/NITP-CSE-1ST-SEM',
    repo: 'https://github.com/Xzen123/NITP-CSE-1ST-SEM',
    img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&auto=format&fit=crop&q=60',
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
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <section id="projects" style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontFamily: "'Roboto Mono', monospace", color: 'var(--color-secondary)', fontWeight: 700, fontSize: 18 }}>$</span>
        <h2 style={{ fontFamily: "'Roboto Mono', monospace", color: 'var(--color-primary)', fontSize: 20, fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.1em', textShadow: '0 0 15px var(--color-glow)', margin: 0 }}>ls -la ./projects</h2>
      </div>
      <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 11, color: 'var(--color-text-dim)', marginBottom: 36, letterSpacing: '0.05em' }}>
        // 6 repos · github.com/Xzen123 · NIT Patna CSE Undergrad
      </div>

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
