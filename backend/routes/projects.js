const express = require('express');

const router = express.Router();

const PROJECTS = [
  {
    name: 'BUNK_CALCULATOR',
    desc: 'Smart attendance utility to calculate safe leaves and recovery classes for target percentages.',
    fullDesc:
      'Bunk Calculator helps students estimate how many classes they can skip or need to attend to maintain target attendance. It is lightweight, fast, and designed for practical day-to-day use.',
    features: [
      'Safe leave estimator',
      'Recovery class calculator',
      'Custom target support',
      'Mobile-friendly interface',
    ],
    stack: ['JavaScript', 'HTML', 'CSS'],
    demo: 'https://xzen123.github.io/Bunk-calculator',
    repo: 'https://github.com/Xzen123/Bunk-calculator',
    img: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&auto=format&fit=crop&q=60',
    status: 'LIVE',
  },
  {
    name: 'CAMPUSPATH',
    desc: 'MERN campus navigation app for students to discover routes and resources quickly.',
    fullDesc:
      'CampusPath is a full-stack web app that provides campus route guidance, resource discovery, and a clean user experience across mobile and desktop devices.',
    features: [
      'Route guidance across campus points',
      'Resource discovery modules',
      'Responsive UI',
      'JWT-based authentication',
    ],
    stack: ['React', 'Node.js', 'Express', 'MongoDB'],
    demo: 'https://github.com/Xzen123/CampusPath',
    repo: 'https://github.com/Xzen123/CampusPath',
    img: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=60',
    status: 'DEV',
  },
  {
    name: 'CITSCINET',
    desc: 'Citizen science collaboration platform for community-driven research participation.',
    fullDesc:
      'CitSciNet connects researchers and citizen scientists through campaign management, observation submissions, and collaborative contribution workflows.',
    features: [
      'Campaign management',
      'Observation submission',
      'Dashboard analytics',
      'REST API architecture',
    ],
    stack: ['React', 'Express', 'MongoDB', 'Node.js'],
    demo: 'https://github.com/Xzen123/CitSciNet',
    repo: 'https://github.com/Xzen123/CitSciNet',
    img: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&auto=format&fit=crop&q=60',
    status: 'DEV',
  },
  {
    name: 'PORTFOLIO_V3',
    desc: 'Personal portfolio with multi-theme UI, settings-driven controls, and responsive sections.',
    fullDesc:
      'A full-stack portfolio featuring a configurable theme system, reusable section layouts, and polished responsive design built with React and Express.',
    features: [
      'Multi-theme support',
      'Settings-first controls',
      'Responsive section architecture',
      'Backend API support',
    ],
    stack: ['React', 'Vite', 'Node.js', 'Express'],
    demo: 'https://portfolio-new-vzv1.onrender.com',
    repo: 'https://github.com/Xzen123/portfolio_new',
    img: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop&q=60',
    status: 'LIVE',
  },
  {
    name: 'SITE',
    desc: 'Minimal personal profile and links page with fast static delivery.',
    fullDesc:
      'A lightweight static profile site for sharing social links and project pointers with minimal overhead and quick page loads.',
    features: [
      'Static site architecture',
      'Clean responsive layout',
      'Fast load performance',
      'Simple maintenance flow',
    ],
    stack: ['HTML', 'CSS'],
    demo: 'https://xzen123.github.io/site/',
    repo: 'https://github.com/Xzen123/site',
    img: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&auto=format&fit=crop&q=60',
    status: 'LIVE',
  },
  {
    name: 'DSA_VISUALIZER',
    desc: 'Interactive tool to visualize algorithms and data structures step-by-step.',
    fullDesc:
      'DSA Visualizer demonstrates sorting, graph, and dynamic programming workflows with interactive controls to improve conceptual understanding.',
    features: [
      'Sorting visualizations',
      'Graph traversal demos',
      'Dynamic programming walkthroughs',
      'Adjustable animation speed',
    ],
    stack: ['JavaScript', 'HTML', 'CSS'],
    demo: 'https://github.com/Xzen123',
    repo: 'https://github.com/Xzen123',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60',
    status: 'WIP',
  },
];

router.get('/status', (_req, res) => {
  res.json({
    source: 'static',
    generatedAt: new Date().toISOString(),
    count: PROJECTS.length,
  });
});

router.get('/', (_req, res) => {
  res.json({
    source: 'static',
    count: PROJECTS.length,
    projects: PROJECTS,
  });
});

module.exports = router;
