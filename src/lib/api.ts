import axios, { type AxiosRequestConfig } from 'axios';
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from './tokenStorage';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15_000,
});

// Routes that must never trigger the refresh-and-retry dance below —
// a 401 from these means the credentials/token themselves are invalid.
const AUTH_ROUTES_WITHOUT_RETRY = ['/auth/login', '/auth/refresh'];

function toError(err: unknown): Error {
  return err instanceof Error ? err : new Error('Unexpected error');
}

// ── Request interceptor: attach JWT from localStorage ──────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => Promise.reject(toError(error)),
);

function logoutAndRedirect() {
  clearTokens();
  window.location.href = '/login';
}

// Dedupes concurrent 401s into a single in-flight refresh call.
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  refreshPromise ??= axios
    .post<{ accessToken: string; refreshToken: string }>(`${API_URL}/auth/refresh`, {
      refreshToken,
    })
    .then(({ data }) => {
      setTokens(data.accessToken, data.refreshToken);
      return data.accessToken;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

// ── Response interceptor: silently refresh once on 401, then retry ────────────
api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    const isAxiosError =
      error != null && typeof error === 'object' && 'response' in error && 'config' in error;

    if (!isAxiosError) {
      return Promise.reject(toError(error));
    }

    const axiosError = error as {
      response?: { status: number };
      config: AxiosRequestConfig & { _retry?: boolean; url?: string };
    };
    const { response, config } = axiosError;

    const isRetryableAuthFailure =
      response?.status === 401 &&
      !config._retry &&
      !AUTH_ROUTES_WITHOUT_RETRY.some((route) => config.url?.includes(route));

    if (isRetryableAuthFailure) {
      config._retry = true;
      try {
        const newAccessToken = await refreshAccessToken();
        config.headers = { ...config.headers, Authorization: `Bearer ${newAccessToken}` };
        return api(config);
      } catch {
        logoutAndRedirect();
        return Promise.reject(new Error('Session expired'));
      }
    }

    if (response?.status === 401) {
      logoutAndRedirect();
    }

    return Promise.reject(toError(error));
  },
);

export default api;
