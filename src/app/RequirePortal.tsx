import { useEffect, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { PortalKey } from '../types/rbac';

/** Route guard — redirects to /login when there's no session, or to the user's
 * own portal when they're not permitted on this one. */
export function RequirePortal({ portal, children }: { portal: PortalKey; children: ReactNode }) {
  const { user, switchPortal } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (user && user.portal !== portal && user.roles.includes(portal)) {
      switchPortal(portal);
    }
  }, [user, portal, switchPortal]);

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!user.roles.includes(portal)) return <Navigate to={`/${user.portal}`} replace />;

  return <>{children}</>;
}
