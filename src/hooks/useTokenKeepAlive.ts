import { useEffect } from 'react';
import { getAccessToken } from '../lib/authToken';
import { refreshAccessToken } from '../lib/api';
import { useAuthStore } from '../store/authStore';

const CHECK_INTERVAL_MS = 5_000;

/**
 * Safety net alongside the reactive 401-refresh in lib/api.ts: every 5s, while a session is
 * active, checks whether the in-memory access token is missing (e.g. cleared by a failed
 * silent refresh elsewhere) and — if so — silently mints a new one from the httpOnly refresh
 * cookie. A failure here just means the session is genuinely over; the next real API call's
 * own 401 handling will redirect to /login as usual.
 */
export function useTokenKeepAlive(): void {
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user) return;

    const id = setInterval(() => {
      if (!getAccessToken()) {
        void refreshAccessToken().catch(() => {});
      }
    }, CHECK_INTERVAL_MS);

    return () => clearInterval(id);
  }, [user]);
}
