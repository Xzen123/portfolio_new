const defaultBaseUrl =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://portfolio-new-vzv1.onrender.com';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || defaultBaseUrl;

export const API_BASE_URL = rawBaseUrl.replace(/\/$/, '');

export const API_ENDPOINTS = {
  theme: `${API_BASE_URL}/api/theme`,
  projects: `${API_BASE_URL}/api/projects?username=Xzen123`,
  projectsStatus: `${API_BASE_URL}/api/projects/status`,
  contact: `${API_BASE_URL}/api/contact`,
};
