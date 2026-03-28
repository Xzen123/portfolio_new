const express = require('express');
const https = require('https');

const router = express.Router();

const GITHUB_API_BASE = 'https://api.github.com';
const GEMINI_MODEL = 'gemini-1.5-flash';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

const aiCache = new Map();
const contributorCountCache = new Map();
const CONTRIBUTOR_CACHE_TTL_MS = 15 * 60 * 1000;

const RATE_LIMIT_FALLBACK_PROJECTS = [
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
    name: 'NITP CSE 1ST SEM.EXE',
    desc: 'Open study resources repository for CSE students.',
    fullDesc: 'Fallback project data used during GitHub API limits. Includes notes, PYQs, and syllabus materials for students.',
    features: ['Notes repository', 'PYQ collection', 'Syllabus resources', 'Open contributions'],
    stack: ['Markdown', 'PDF', 'Open Source'],
    demo: 'https://github.com/Xzen123/NITP-CSE-1ST-SEM',
    repo: 'https://github.com/Xzen123/NITP-CSE-1ST-SEM',
    img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&auto=format&fit=crop&q=60',
  },
];

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
    return fallbackProject(repo);
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
    return fallbackProject(repo);
  }

  const parsed = JSON.parse(data);
  const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    return fallbackProject(repo);
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

    aiCache.set(cacheKey, normalized);
    return normalized;
  } catch {
    return fallbackProject(repo);
  }
}

router.get('/', async (req, res) => {
  const username = req.query.username || process.env.GITHUB_USERNAME || 'Xzen123';

  try {
    const repos = await getGithubRepos(username);
    const ownRepos = repos.filter((repo) => !repo.fork);
    const candidateRepos = ownRepos
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

    const selectedRepos = rankedRepos
      .sort((a, b) => b.rankingScore - a.rankingScore)
      .slice(0, 6)
      .map((item) => item.repo);

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
