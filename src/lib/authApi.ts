import api from './api';
import { clearTokens, setTokens } from './tokenStorage';
import type { AuthUser } from '../types/rbac';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export async function login(mobileNumber: string, password: string): Promise<AuthUser> {
  const { data } = await api.post<LoginResponse>('/auth/login', { mobileNumber, password });
  setTokens(data.accessToken, data.refreshToken);
  return data.user;
}

/** Rehydrates the session from a stored access token — used once on app boot. */
export async function fetchCurrentUser(): Promise<AuthUser> {
  const { data } = await api.get<AuthUser>('/auth/me');
  return data;
}

export async function forgotPassword(mobileNumber: string): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>('/auth/forgot-password', { mobileNumber });
  return data;
}

export async function resetPassword(
  mobileNumber: string,
  otp: string,
  newPassword: string,
): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>('/auth/reset-password', {
    mobileNumber,
    otp,
    newPassword,
  });
  return data;
}

export function logoutLocal(): void {
  clearTokens();
}
