import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { LiquidSidebar } from './LiquidSidebar';
import { CommandPalette } from '../shared/CommandPalette';
import { UserDock } from '../shared/UserDock';
import { useLayout, useLayoutStore } from '../../hooks/useLayout';
import { useAuth } from '../../hooks/useAuth';

const SIDEBAR_EXPANDED_WIDTH = 280;
const SIDEBAR_COLLAPSED_WIDTH = 72;

/**
 * The single app shell for every authenticated portal. Navigation and search
 * live in the sidebar (see LiquidSidebar); identity, account settings and
 * theme switching live in the fixed top-right UserDock instead of a full
 * top bar, so both stay reachable regardless of sidebar expanded state.
 */
export function AppShellSidebar() {
  const { isMobile, sidebarExpanded } = useLayout();
  const { user } = useAuth();
  const openMobileDrawer = useLayoutStore((s) => s.openMobileDrawer);

  if (!user) return null;

  const contentOffset = isMobile
    ? 0
    : sidebarExpanded
      ? SIDEBAR_EXPANDED_WIDTH
      : SIDEBAR_COLLAPSED_WIDTH;

  return (
    <div style={{ minHeight: '100vh' }}>
      <LiquidSidebar />
      <UserDock />

      {isMobile && (
        <button
          onClick={openMobileDrawer}
          aria-label="Open navigation"
          style={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 300,
            width: 40,
            height: 40,
            borderRadius: 10,
            border: '1px solid var(--border-default)',
            background: 'var(--nav-glass-bg)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Menu size={18} />
        </button>
      )}

      <div
        style={{
          marginLeft: contentOffset,
          transition: 'margin-left 350ms cubic-bezier(0.22, 1, 0.36, 1)',
          minHeight: '100vh',
        }}
      >
        <main style={{ padding: isMobile ? '76px 20px 24px' : '88px 24px 24px' }}>
          <Outlet />
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
