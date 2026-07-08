import { useEffect, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { PortalKey } from '../types/rbac';

/**
 * Dev-mode route guard — there is no backend session yet (see the spec's
 * Scope Note), so this only checks the mock authStore populated by the
 * portal picker on /login. Swap for a real session check once auth lands.
 */
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
