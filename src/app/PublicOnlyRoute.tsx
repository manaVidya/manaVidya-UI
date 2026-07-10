import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/** Guards public-only routes (login, the temporary "/" redirect) — bounces an
 * already-authenticated user straight to their own portal instead of showing them
 * the login form again. */
export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  if (user) return <Navigate to={`/${user.portal}`} replace />;

  return <>{children}</>;
}
