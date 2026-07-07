import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15_000,
});

// ── Request interceptor: attach JWT from localStorage ──────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mv_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => Promise.reject(error instanceof Error ? error : new Error(String(error))),
);

// ── Response interceptor: handle 401 globally ─────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const status =
      error != null &&
      typeof error === 'object' &&
      'response' in error &&
      error.response != null &&
      typeof error.response === 'object' &&
      'status' in error.response
        ? (error.response as { status: number }).status
        : null;

    if (status === 401) {
      localStorage.removeItem('mv_access_token');
      localStorage.removeItem('mv_refresh_token');
      // Redirect to login — use window.location to avoid circular router imports
      window.location.href = '/login';
    }
    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
  },
);

export default api;
