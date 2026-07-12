import { useRef, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ChevronDown, LogOut, Moon, Settings, Sun } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useClickOutside } from '../../hooks/useClickOutside';
import { MOCK_NOTIFICATIONS } from '../../lib/mockData';

const menuItemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  width: '100%',
  padding: '10px 14px',
  border: 'none',
  background: 'transparent',
  color: 'var(--text-secondary)',
  fontSize: 13,
  fontFamily: 'inherit',
  textAlign: 'left',
  cursor: 'pointer',
};

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  useClickOutside(wrapperRef, open, () => setOpen(false));

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.97 }}
        aria-label="Notifications"
        aria-haspopup="menu"
        aria-expanded={open}
        style={{
          position: 'relative',
          width: 44,
          height: 44,
          borderRadius: 999,
          border: '1px solid var(--border-default)',
          background: 'var(--nav-glass-bg)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: 'var(--nav-shadow)',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <Bell size={17} />
        <span
          style={{
            position: 'absolute',
            top: 10,
            right: 11,
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: 'var(--status-error-500)',
          }}
        />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: 280,
              maxWidth: '80vw',
              background: 'var(--nav-glass-bg-strong)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid var(--border-default)',
              borderRadius: 12,
              overflow: 'hidden',
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
                  style={{
                    margin: 0,
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                  }}
                >
                  {n.title}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-tertiary)' }}>
                  {n.date}
                </p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AccountMenu() {
  const { user, themeMode, toggleThemeMode, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  useClickOutside(wrapperRef, open, () => setOpen(false));

  if (!user) return null;

  const goToSettings = () => {
    setOpen(false);
    void navigate(`/${user.portal}/profile`);
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.97 }}
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={open}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 14px 6px 6px',
          borderRadius: 999,
          border: '1px solid var(--border-default)',
          background: 'var(--nav-glass-bg)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: 'var(--nav-shadow)',
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
          aria-hidden
        >
          {user.name.slice(0, 1).toUpperCase()}
        </div>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text-primary)',
            maxWidth: 140,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {user.name}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ display: 'flex', color: 'var(--text-tertiary)' }}
        >
          <ChevronDown size={14} />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: 240,
              background: 'var(--nav-glass-bg-strong)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid var(--border-default)',
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: 'var(--nav-shadow)',
            }}
          >
            <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)' }}>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
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
                {user.portal} Portal
              </p>
            </div>

            <button role="menuitem" onClick={goToSettings} style={menuItemStyle}>
              <Settings size={16} />
              Account Settings
            </button>

            <button role="menuitem" onClick={toggleThemeMode} style={menuItemStyle}>
              {themeMode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              {themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </button>

            <button
              role="menuitem"
              onClick={() => {
                setOpen(false);
                logout();
              }}
              style={{ ...menuItemStyle, color: 'var(--status-error-500)' }}
            >
              <LogOut size={16} />
              Log Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Floating identity dock, fixed top-right on every portal — replaces the old
 * sidebar-footer profile button and notification bell so both stay in one
 * constant place regardless of whether the sidebar is expanded or collapsed.
 */
export function UserDock() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 300,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8,
      }}
    >
      <NotificationBell />
      <AccountMenu />
    </div>
  );
}
