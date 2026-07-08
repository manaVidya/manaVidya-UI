import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { PortalKey } from '../../types/rbac';

const PORTAL_LABELS: Record<PortalKey, string> = {
  admin: 'Admin',
  teacher: 'Teacher',
  parent: 'Parent',
  student: 'Student',
};

/**
 * Lets multi-role accounts switch which portal they're acting as — e.g. an
 * Admin previewing every portal, or a Teacher who is also a parent at the
 * school (the exact multi-role case called out in types/rbac.ts).
 * Renders nothing for single-role accounts.
 */
export function PortalSwitcher({ compact = false }: { compact?: boolean }) {
  const { user, availablePortals, switchPortal } = useAuth();
  const navigate = useNavigate();

  if (!user || availablePortals.length <= 1) return null;

  return (
    <div
      role="tablist"
      aria-label="Switch portal"
      style={{
        display: 'grid',
        gridTemplateColumns: compact ? 'repeat(auto-fit, minmax(70px, 1fr))' : 'repeat(2, 1fr)',
        gap: 4,
        padding: compact ? 0 : '0 16px 12px',
      }}
    >
      {availablePortals.map((portal) => (
        <button
          key={portal}
          role="tab"
          aria-selected={user.portal === portal}
          data-portal={portal}
          onClick={() => {
            switchPortal(portal);
            void navigate(`/${portal}`);
          }}
          style={{
            padding: '6px 12px',
            borderRadius: 8,
            border: 'none',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            background: user.portal === portal ? 'var(--portal-500)' : 'var(--bg-surface-2)',
            color: user.portal === portal ? 'var(--text-inverse)' : 'var(--text-secondary)',
            transition: 'background 150ms ease',
          }}
        >
          {PORTAL_LABELS[portal]}
        </button>
      ))}
    </div>
  );
}
