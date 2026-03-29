const express = require('express');
const https = require('https');

const router = express.Router();

const GITHUB_API_BASE = 'https://api.github.com';
const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

const aiCache = new Map();
const contributorCountCache = new Map();
const CONTRIBUTOR_CACHE_TTL_MS = 15 * 60 * 1000;

const PRIORITY_REPO_ORDER = [
  'portfolio_new',
  'citscinet_ssfc',
  'nextjs-boilerplate',
  'campuspath',
];

const PROJECT_LIMIT = 7;

const PINNED_PROJECT_DETAILS = {
  portfolio_new: {
    name: 'PORTFOLIO NEW.EXE',
    desc: 'Personal portfolio platform with dynamic project sync and API-backed contact flow.',
    fullDesc: 'A full portfolio system that integrates frontend UX with backend APIs for projects, contact automation, and theme persistence. Built to stay resilient with live/fallback data modes.',
    img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60',
  },
  citscinet_ssfc: {
    name: 'CITSCINET SSFC.EXE',
    desc: 'Citizen science collaboration platform connecting researchers and volunteers.',
    fullDesc: 'A social and workflow-driven platform for citizen science initiatives where participants can join projects, submit data, and collaborate with researchers.',
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60',
  },
  'nextjs-boilerplate': {
    name: 'SUSTAIN BITE.EXE',
    desc: 'Production-ready Next.js starter tailored for fast shipping and clean architecture.',
    fullDesc: 'A reusable Next.js baseline designed for rapid project setup, maintainable structure, and scalable frontend development workflows.',
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60',
  },
  campuspath: {
    name: 'CAMPUSPATH.EXE',
    desc: 'Campus navigation and pathfinding utility built for practical student use.',
    fullDesc: 'A route-guidance utility that helps students navigate campus locations using shortest-path logic and structured destination data.',
    img: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=60',
  },
};

const RATE_LIMIT_FALLBACK_PROJECTS = [
  {
    name: 'PORTFOLIO NEW.EXE',
    desc: 'Personal portfolio web app with dynamic projects and contact workflow.',
    fullDesc: 'Fallback project data used during API limits. This repository hosts your main portfolio application with frontend and backend integration.',
    features: ['Dynamic project section', 'Theme persistence', 'Contact workflow', 'Production deployment'],
    stack: ['React', 'Node.js', 'Express', 'MongoDB'],
    demo: 'https://github.com/Xzen123/portfolio_new',
    repo: 'https://github.com/Xzen123/portfolio_new',
    img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60',
  },
  {
    name: 'CITSCINET SSFC.EXE',
    desc: 'Citizen science collaboration platform connecting researchers and volunteers.',
    fullDesc: 'Fallback project data used when live API data is unavailable. This project supports participatory data collection and collaboration workflows.',
    features: ['Project enrollment flows', 'Data submission workflow', 'Community interaction', 'Role-based access'],
    stack: ['JavaScript', 'Node.js', 'Express', 'MongoDB'],
    demo: 'https://github.com/Xzen123/CitSciNet_SSFC',
    repo: 'https://github.com/Xzen123/CitSciNet_SSFC',
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60',
  },
  {
    name: 'SUSTAIN BITE.EXE',
    desc: 'Starter template for quickly bootstrapping modern Next.js applications.',
    fullDesc: 'Fallback project data used during service degradation. This repository provides a reusable baseline for scalable Next.js projects.',
    features: ['Production-ready scaffolding', 'Reusable structure', 'Fast bootstrap workflow', 'Clean starter configuration'],
    stack: ['Next.js', 'React', 'TypeScript', 'Node.js'],
    demo: 'https://github.com/Xzen123/nextjs-boilerplate',
    repo: 'https://github.com/Xzen123/nextjs-boilerplate',
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60',
  },
  {
    name: 'CAMPUSPATH.EXE',
    desc: 'Campus navigation and shortest-path utility for NIT Patna.',
    fullDesc: 'Fallback project data shown when live generation is unavailable. CampusPath helps students navigate destinations using efficient pathfinding logic.',
    features: ['Shortest-path navigation', 'Campus destination mapping', 'Route guidance flow', 'Student-focused utility'],
    stack: ['TypeScript', 'React', 'Algorithms'],
    demo: 'https://github.com/Xzen123/CampusPath',
    repo: 'https://github.com/Xzen123/CampusPath',
    img: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=60',
  },
  {
    name: 'BUNK CALCULATOR.EXE',
    desc: 'Attendance planner utility for safe leave and recovery calculations.',
    fullDesc: 'Fallback project data used when GitHub API is rate-limited. This project helps calculate safe class leaves and attendance recovery plans.',
    features: ['Attendance goal input', 'Safe bunk estimate', 'Recovery class planning', 'Fast lightweight UI'],
    stack: ['JavaScript', 'HTML', 'CSS'],
    demo: 'https://xzen123.github.io/Bunk-calculator',
    repo: 'https://github.com/Xzen123/Bunk-calculator',
    img: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&auto=format&fit=crop&q=60',
  },
  {
    name: 'SITE.EXE',
    desc: 'Minimal profile and social links landing page.',
    fullDesc: 'Fallback project data used during GitHub API outages. This project is a lightweight profile link hub with responsive layout.',
    features: ['Responsive design', 'Static hosting friendly', 'Simple customizable layout', 'Fast load time'],
    stack: ['HTML', 'CSS'],
    demo: 'https://xzen123.github.io/site/',
    repo: 'https://github.com/Xzen123/site',
    img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60',
  },
  {
    name: 'PDF SCRAPPER V01.EXE',
    desc: 'PDF extraction utility for structured academic and technical documents.',
    fullDesc: 'Fallback project data used during API limits. This project extracts readable structured outputs from complex PDF sources.',
    features: ['PDF content extraction', 'Structured output generation', 'Academic document support', 'Automation-friendly workflow'],
    stack: ['Python', 'PyMuPDF', 'pandas'],
    demo: 'https://github.com/Xzen123/pdf_scrapper_v01',
    repo: 'https://github.com/Xzen123/pdf_scrapper_v01',
    img: 'https://images.unsplash.com/photo-1568209865332-a15790aed756?w=800&auto=format&fit=crop&q=60',
  },
  {
    name: 'LABFILES SEM4.EXE',
    desc: 'Lab and coursework repository for semester project and practical files.',
    fullDesc: 'Fallback project data used during API limits. This repository organizes semester lab work for quick reference and reuse.',
    features: ['Organized lab files', 'Semester workflow support', 'Academic project tracking', 'Reference-friendly structure'],
    stack: ['Jupyter Notebook', 'Python', 'Coursework'],
    demo: 'https://github.com/Xzen123/labfiles_sem4',
    repo: 'https://github.com/Xzen123/labfiles_sem4',
    img: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=800&auto=format&fit=crop&q=60',
  },
];

function isExcludedRepo(repoName) {
  const value = String(repoName || '').toLowerCase();
  return /nitp.*cse.*sem|nit-p.*cse.*sem|nitp-cse|nitp_cse/.test(value);
}

function httpsRequest(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({ status: res.statusCode, data, headers: res.headers });
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(body);
    }

    req.end();
  });
}

function githubHeaders() {
  const headers = {
    'User-Agent': 'portfolio-backend',
    Accept: 'application/vnd.github+json',
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

async function getGithubRepos(username) {
  let page = 1;
  const repos = [];

  while (true) {
    const url = `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=100&page=${page}`;
    const { status, data } = await httpsRequest(url, {
      method: 'GET',
      headers: githubHeaders(),
    });

    if (status !== 200) {
      throw new Error(`GitHub API error ${status}`);
    }

    const batch = JSON.parse(data);
    repos.push(...batch);

    if (batch.length < 100) {
      break;
    }

    page += 1;
  }

  return repos;
}

function parseLastPageFromLink(linkHeader) {
  if (!linkHeader) return null;
  const parts = linkHeader.split(',').map((p) => p.trim());
  const lastPart = parts.find((p) => p.includes('rel="last"'));
  if (!lastPart) return null;
  const match = lastPart.match(/[?&]page=(\d+)/);
  return match ? Number(match[1]) : null;
}

async function getContributorCount(owner, repo) {
  const cacheKey = `${owner}/${repo}`;
  const cached = contributorCountCache.get(cacheKey);
  if (cached && Date.now() - cached.at < CONTRIBUTOR_CACHE_TTL_MS) {
    return cached.count;
  }

  const url = `${GITHUB_API_BASE}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contributors?per_page=1&anon=1`;
  const { status, data, headers } = await httpsRequest(url, {
    method: 'GET',
    headers: githubHeaders(),
  });

  if (status !== 200) {
    return 0;
  }

  const fromLink = parseLastPageFromLink(headers.link);
  const parsed = JSON.parse(data);
  const count = fromLink || (Array.isArray(parsed) ? parsed.length : 0);
  contributorCountCache.set(cacheKey, { count, at: Date.now() });
  return count;
}

function fallbackProject(repo) {
  const language = repo.language || 'General';
  const topics = Array.isArray(repo.topics) ? repo.topics.slice(0, 5) : [];
  const stack = [language, ...topics].filter(Boolean).slice(0, 4);
  const name = `${repo.name.replace(/[-_]/g, ' ').toUpperCase()}.EXE`;
  const desc = repo.description || `${repo.name} project from GitHub.`;

  return {
    name,
    desc,
    fullDesc: desc,
    features: [
      `Repository stars: ${repo.stargazers_count || 0}`,
      `Repository forks: ${repo.forks_count || 0}`,
      `Updated: ${new Date(repo.updated_at).toLocaleDateString('en-IN')}`,
    ],
    stack: stack.length ? stack : ['Open Source'],
    demo: repo.homepage || repo.html_url,
    repo: repo.html_url,
    img: `https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60&sig=${repo.id}`,
  };
}

function applyPinnedProjectDetails(repoName, project) {
  const key = String(repoName || '').toLowerCase();
  const pinned = PINNED_PROJECT_DETAILS[key];
  if (!pinned) {
    return project;
  }

  return {
    ...project,
    name: pinned.name || project.name,
    desc: pinned.desc || project.desc,
    fullDesc: pinned.fullDesc || project.fullDesc,
    img: pinned.img || project.img,
  };
}

function parseGeminiJson(text) {
  const fenced = text.match(/```json\s*([\s\S]*?)\s*```/i);
  const candidate = fenced ? fenced[1] : text;

  try {
    return JSON.parse(candidate);
  } catch {
    const firstBrace = candidate.indexOf('{');
    const lastBrace = candidate.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(candidate.slice(firstBrace, lastBrace + 1));
    }
    throw new Error('Invalid Gemini JSON');
  }
}

async function getGithubApiStatus() {
  try {
    const { status, data } = await httpsRequest(`${GITHUB_API_BASE}/rate_limit`, {
      method: 'GET',
      headers: githubHeaders(),
    });

    if (status !== 200) {
      return { mode: 'fallback', reason: `github-http-${status}` };
    }

    const payload = JSON.parse(data);
    const remaining = payload?.resources?.core?.remaining;
    if (typeof remaining === 'number' && remaining <= 0) {
      return { mode: 'fallback', reason: 'github-rate-limit' };
    }

    return { mode: 'live', reason: process.env.GITHUB_TOKEN ? 'token' : 'unauthenticated' };
  } catch {
    return { mode: 'fallback', reason: 'github-unreachable' };
  }
}

async function getGeminiApiStatus() {
  if (!process.env.GEMINI_API_KEY) {
    return { mode: 'fallback', reason: 'missing-key' };
  }

  const url = `${GEMINI_API_BASE}/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`;
  const body = JSON.stringify({
    contents: [{ role: 'user', parts: [{ text: 'health check' }] }],
    generationConfig: { maxOutputTokens: 8, temperature: 0 },
  });

  try {
    const { status } = await httpsRequest(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      body
    );

    if (status === 200) {
      return { mode: 'live', reason: 'ok' };
    }

    return { mode: 'fallback', reason: `gemini-http-${status}` };
  } catch {
    return { mode: 'fallback', reason: 'gemini-unreachable' };
  }
}

router.get('/status', async (_req, res) => {
  const [github, gemini] = await Promise.all([getGithubApiStatus(), getGeminiApiStatus()]);
  res.json({ github, gemini });
});

async function generateProjectWithGemini(repo) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return applyPinnedProjectDetails(repo.name, fallbackProject(repo));
  }

  const cacheKey = `${repo.full_name}:${repo.updated_at}`;
  if (aiCache.has(cacheKey)) {
    return aiCache.get(cacheKey);
  }

  const prompt = [
    'You are generating project card content for a developer portfolio.',
    'Return strict JSON only.',
    'Do not use emoji.',
    'Keep language concise and professional.',
    'JSON schema:',
    '{',
    '  "name": "string, uppercase terminal style ending with .EXE",',
    '  "desc": "single short sentence, max 160 chars",',
    '  "fullDesc": "2-4 concise sentences",',
    '  "features": ["feature 1", "feature 2", "feature 3", "feature 4"],',
    '  "stack": ["tech1", "tech2", "tech3", "tech4"]',
    '}',
    'Repository details:',
    JSON.stringify({
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      language: repo.language,
      topics: repo.topics || [],
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      homepage: repo.homepage,
      updated_at: repo.updated_at,
    }),
  ].join('\n');

  const body = JSON.stringify({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 800,
      responseMimeType: 'application/json',
    },
  });

  const url = `${GEMINI_API_BASE}/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const { status, data } = await httpsRequest(
    url,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    },
    body
  );

  if (status !== 200) {
    return applyPinnedProjectDetails(repo.name, fallbackProject(repo));
  }

  const parsed = JSON.parse(data);
  const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    return applyPinnedProjectDetails(repo.name, fallbackProject(repo));
  }

  try {
    const projectData = parseGeminiJson(text);
    const normalized = {
      name: projectData.name || `${repo.name.toUpperCase()}.EXE`,
      desc: projectData.desc || repo.description || `${repo.name} project from GitHub.`,
      fullDesc: projectData.fullDesc || projectData.desc || repo.description || `${repo.name} project from GitHub.`,
      features: Array.isArray(projectData.features) && projectData.features.length
        ? projectData.features.slice(0, 4)
        : fallbackProject(repo).features,
      stack: Array.isArray(projectData.stack) && projectData.stack.length
        ? projectData.stack.slice(0, 6)
        : fallbackProject(repo).stack,
      demo: repo.homepage || repo.html_url,
      repo: repo.html_url,
      img: `https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60&sig=${repo.id}`,
    };

    const finalProject = applyPinnedProjectDetails(repo.name, normalized);
    aiCache.set(cacheKey, finalProject);
    return finalProject;
  } catch {
    return applyPinnedProjectDetails(repo.name, fallbackProject(repo));
  }
}

router.get('/', async (req, res) => {
  const username = req.query.username || process.env.GITHUB_USERNAME || 'Xzen123';

  try {
    const repos = await getGithubRepos(username);
    const ownRepos = repos.filter((repo) => !repo.fork && !isExcludedRepo(repo.name));
    const priorityRepos = PRIORITY_REPO_ORDER
      .map((name) => ownRepos.find((repo) => repo.name.toLowerCase() === name))
      .filter(Boolean);

    const prioritySet = new Set(priorityRepos.map((repo) => repo.name.toLowerCase()));

    const candidateRepos = ownRepos
      .filter((repo) => !prioritySet.has(repo.name.toLowerCase()))
      .sort((a, b) => Number(b.size || 0) - Number(a.size || 0))
      .slice(0, 25);

    const rankedRepos = await Promise.all(
      candidateRepos.map(async (repo) => {
        const contributors = await getContributorCount(repo.owner?.login || username, repo.name).catch(() => 0);
        const sizeScore = Number(repo.size || 0);
        const contributionScore = contributors * 100;
        return {
          repo,
          contributors,
          rankingScore: sizeScore + contributionScore,
        };
      })
    );

    const rankedSelected = rankedRepos
      .sort((a, b) => b.rankingScore - a.rankingScore)
      .slice(0, Math.max(0, PROJECT_LIMIT - priorityRepos.length))
      .map((item) => item.repo);

    const selectedRepos = [...priorityRepos, ...rankedSelected].slice(0, PROJECT_LIMIT);

    const projects = await Promise.all(selectedRepos.map((repo) => generateProjectWithGemini(repo)));

    res.json({
      username,
      count: projects.length,
      source: process.env.GEMINI_API_KEY ? 'github+gemini' : 'github',
      projects,
    });
  } catch (err) {
    console.error('GET /api/projects error:', err.message);
    if (String(err.message).includes('GitHub API error 403')) {
      return res.json({
        username,
        count: RATE_LIMIT_FALLBACK_PROJECTS.length,
        source: 'fallback',
        warning: 'GitHub API rate limit reached. Add GITHUB_TOKEN in backend .env for higher limits.',
        projects: RATE_LIMIT_FALLBACK_PROJECTS,
      });
    }

    res.status(500).json({ error: 'Unable to load projects from GitHub' });
  }
});

module.exports = router;
