import api from './api';
import { setAccessToken } from './authToken';
import type { AuthUser } from '../types/rbac';

interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export async function login(mobileNumber: string, password: string): Promise<AuthUser> {
  const { data } = await api.post<LoginResponse>(
    '/auth/login',
    { mobileNumber, password },
    { silent: true }, // LoginPage renders its own inline error/notice
  );
  setAccessToken(data.accessToken);
  return data.user;
}

/** Rehydrates the session from the httpOnly refresh cookie — used once on app boot. */
export async function fetchCurrentUser(): Promise<AuthUser> {
  const { data } = await api.get<AuthUser>('/auth/me', {
    silent: true,
    suppressAuthRedirect: true,
  });
  return data;
}

export async function forgotPassword(mobileNumber: string): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>(
    '/auth/forgot-password',
    { mobileNumber },
    { silent: true },
  );
  return data;
}

export async function resetPassword(
  mobileNumber: string,
  otp: string,
  newPassword: string,
): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>(
    '/auth/reset-password',
    { mobileNumber, otp, newPassword },
    { silent: true },
  );
  return data;
}

/** Revokes the refresh token server-side and clears its cookie; never throws. */
export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout', {}, { silent: true });
  } catch {
    // Best-effort — the local session is cleared regardless (see authStore.logout).
  } finally {
    setAccessToken(null);
  }
}
