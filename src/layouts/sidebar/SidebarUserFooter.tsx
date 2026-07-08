import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useClickOutside } from '../../hooks/useClickOutside';
import { MOCK_NOTIFICATIONS } from '../../lib/mockData';

/** Avatar opens the portal's profile page; bell opens a quick dummy notification preview. */
export function SidebarUserFooter({ expanded }: { expanded: boolean }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  useClickOutside(wrapperRef, notifOpen, () => setNotifOpen(false));

  if (!user) return null;

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '0 12px 8px',
      }}
    >
      <button
        onClick={() => void navigate(`/${user.portal}/profile`)}
        aria-label="Open profile"
        style={{
          flex: expanded ? 1 : undefined,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          minWidth: 0,
          padding: '8px 10px',
          borderRadius: 10,
          border: '1px solid var(--border-default)',
          background: 'var(--bg-surface-1)',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            flexShrink: 0,
            background: 'var(--portal-500)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--text-inverse)',
          }}
        >
          {user.name.slice(0, 1).toUpperCase()}
        </div>
        {expanded && (
          <div style={{ overflow: 'hidden', textAlign: 'left' }}>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {user.name}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 11,
                color: 'var(--text-tertiary)',
                textTransform: 'capitalize',
              }}
            >
              My profile
            </p>
          </div>
        )}
      </button>

      <button
        onClick={() => setNotifOpen((o) => !o)}
        aria-label="Notifications"
        style={{
          width: 36,
          height: 36,
          flexShrink: 0,
          borderRadius: 10,
          border: '1px solid var(--border-default)',
          background: 'var(--bg-surface-1)',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
        }}
      >
        <Bell size={15} />
        <span
          style={{
            position: 'absolute',
            top: 6,
            right: 7,
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'var(--status-error-500)',
          }}
        />
      </button>

      {notifOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            right: 0,
            width: 280,
            maxWidth: '80vw',
            background: 'var(--nav-glass-bg-strong)',
            backdropFilter: 'blur(24px)',
            border: '1px solid var(--border-default)',
            borderRadius: 12,
            overflow: 'hidden',
            zIndex: 250,
            boxShadow: 'var(--nav-shadow)',
          }}
        >
          {MOCK_NOTIFICATIONS.slice(0, 3).map((n, i) => (
            <div
              key={n.id}
              style={{
                padding: '10px 12px',
                borderBottom: i < 2 ? '1px solid var(--border-subtle)' : 'none',
              }}
            >
              <p
                style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}
              >
                {n.title}
              </p>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-tertiary)' }}>
                {n.date}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
