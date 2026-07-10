import axios, { isAxiosError, isCancel, type AxiosRequestConfig } from 'axios';
import { getAccessToken, setAccessToken } from './authToken';
import { useToastStore } from '../store/toastStore';
import { getErrorMessage } from './getErrorMessage';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

declare module 'axios' {
  export interface AxiosRequestConfig {
    /** Suppress the automatic success/error toast for this request entirely. */
    silent?: boolean;
    /** Override the generic auto-toast success message with a caller-specific one. */
    successMessage?: string;
    /**
     * On an unrecoverable 401 (no valid session at all), skip the hard redirect to /login.
     * Used only by the boot-time session probe — every page (including /login itself)
     * fires that probe, and a logged-out visitor hitting it shouldn't be bounced/reloaded.
     */
    suppressAuthRedirect?: boolean;
  }
}

const api = axios.create({
  baseURL: API_URL,
  // Sends/receives the httpOnly refresh-token cookie on every request; harmless for routes
  // that don't use it since it's scoped to the /auth path on the server.
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15_000,
});

// Routes that must never trigger the refresh-and-retry dance below —
// a 401 from these means the credentials/token themselves are invalid.
const AUTH_ROUTES_WITHOUT_RETRY = ['/auth/login', '/auth/refresh', '/auth/logout'];

const SUCCESS_TOAST_BY_METHOD: Record<string, string> = {
  post: 'Saved successfully.',
  put: 'Updated successfully.',
  patch: 'Updated successfully.',
  delete: 'Deleted successfully.',
};

function toError(err: unknown): Error {
  return err instanceof Error ? err : new Error('Unexpected error');
}

// ── Request interceptor: attach the in-memory JWT ──────────────────────────────
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
  setAccessToken(null);
  // Best-effort: clear the refresh cookie server-side too. Fired and forgotten — if the
  // session is already dead this call failing doesn't change anything for the user.
  void axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true }).catch(() => {});
  window.location.href = '/login';
}

// Dedupes concurrent 401s into a single in-flight refresh call.
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  refreshPromise ??= axios
    .post<{ accessToken: string }>(`${API_URL}/auth/refresh`, {}, { withCredentials: true })
    .then(({ data }) => {
      setAccessToken(data.accessToken);
      return data.accessToken;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

// ── Response interceptor: silent refresh-on-401, then global success/error toasts ─────────
api.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toLowerCase();
    if (!response.config.silent && method && method !== 'get') {
      const message =
        response.config.successMessage ??
        (response.data as { message?: string } | undefined)?.message ??
        SUCCESS_TOAST_BY_METHOD[method] ??
        'Request completed successfully.';
      useToastStore.getState().push('success', message);
    }
    return response;
  },
  async (error: unknown) => {
    if (isCancel(error) || !isAxiosError(error)) {
      return Promise.reject(toError(error));
    }

    const config = error.config as AxiosRequestConfig & { _retry?: boolean; url?: string };
    const response = error.response;

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
        if (!config.suppressAuthRedirect) {
          logoutAndRedirect();
        } else {
          setAccessToken(null);
        }
        return Promise.reject(new Error('Session expired'));
      }
    }

    if (response?.status === 401 && !config.suppressAuthRedirect) {
      logoutAndRedirect();
    }

    if (!config.silent) {
      useToastStore.getState().push('error', getErrorMessage(error));
    }

    return Promise.reject(toError(error));
  },
);

export default api;
