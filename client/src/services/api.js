// Public URL of the deployed API (not a secret). Used by production builds when
// VITE_API_URL is not set; local dev uses the Vite proxy at /api.
const PRODUCTION_API_URL = 'https://finance-website-blcg.onrender.com/api';

const BASE_URL = (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? PRODUCTION_API_URL : '/api')).replace(/\/+$/, '');

async function request(path, options = {}) {
  const res = await fetch(BASE_URL + path, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
};
