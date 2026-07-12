import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useLayout } from '../../hooks/useLayout';
import { usePermissions } from '../../hooks/usePermissions';
import { useAuth } from '../../hooks/useAuth';
import { useNavBadges } from '../../hooks/useNavBadges';
import { NAVIGATION_CONFIG, type NavEntry } from '../../lib/navigationConfig';
import { EASE } from '../../lib/motion';
import { PortalSwitcher } from '../../components/foundation/PortalSwitcher';
import { ChildSwitcher } from '../../components/foundation/ChildSwitcher';
import { SidebarSearch } from './SidebarSearch';
import { SidebarNavItem } from './SidebarNavItem';
import { SidebarNavAccordion } from './SidebarNavAccordion';

const SIDEBAR_EXPANDED_WIDTH = 280;
const SIDEBAR_COLLAPSED_WIDTH = 72;

const sidebarVariants = {
  expanded: { width: SIDEBAR_EXPANDED_WIDTH, transition: { duration: 0.35, ease: EASE.spring } },
  collapsed: { width: SIDEBAR_COLLAPSED_WIDTH, transition: { duration: 0.35, ease: EASE.spring } },
};

/**
 * The one shell for every portal (Admin, Teacher, Parent, Student) — only the
 * colour identity (--portal-*) changes between them. Profile/account/theme
 * controls live in the top-right UserDock, not here — see AppShellSidebar.
 */
export function LiquidSidebar() {
  const { sidebarExpanded, toggleSidebar, isMobile, mobileDrawerOpen, closeMobileDrawer } =
    useLayout();
  const { user } = useAuth();
  const { can } = usePermissions();
  const badges = useNavBadges();
  const { pathname } = useLocation();

  if (!user) return null;

  const sections = NAVIGATION_CONFIG[user.portal];
  const expanded = isMobile ? true : sidebarExpanded;

  const renderEntry = (entry: NavEntry) => {
    if (entry.kind === 'item') {
      if (entry.rbacKey && !can(entry.rbacKey)) return null;
      return (
        <SidebarNavItem
          key={entry.to}
          to={entry.to}
          label={entry.label}
          icon={entry.icon}
          expanded={expanded}
          active={pathname === entry.to || pathname.startsWith(`${entry.to}/`)}
          badge={entry.badgeKey ? badges[entry.badgeKey] : undefined}
        />
      );
    }
    if (entry.rbacKey && !can(entry.rbacKey)) return null;
    const visibleChildren = entry.children.filter((c) => !c.rbacKey || can(c.rbacKey));
    if (visibleChildren.length === 0) return null;
    return (
      <SidebarNavAccordion
        key={entry.label}
        label={entry.label}
        icon={entry.icon}
        expanded={expanded}
        defaultOpen={visibleChildren.some((c) => pathname.startsWith(c.to))}
      >
        {visibleChildren.map((child) => (
          <SidebarNavItem
            key={child.to}
            to={child.to}
            label={child.label}
            icon={child.icon}
            expanded={expanded}
            active={pathname === child.to}
            nested
          />
        ))}
      </SidebarNavAccordion>
    );
  };

  const content = (
    <motion.aside
      className="portal-glow-wash"
      variants={sidebarVariants}
      animate={expanded ? 'expanded' : 'collapsed'}
      initial={false}
      style={{
        position: isMobile ? 'relative' : 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        background: 'var(--nav-glass-bg)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderRight: '1px solid var(--border-default)',
        boxShadow: 'var(--nav-shadow)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: '100vh',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '20px 16px',
          minHeight: 72,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, var(--portal-400), var(--portal-600))',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 5,
          }}
          aria-hidden
        >
          <img
            src="/favicon.svg"
            alt=""
            width={22}
            height={22}
            style={{ display: 'block', filter: 'brightness(0) invert(1)' }}
          />
        </div>
        {expanded && (
          <div style={{ overflow: 'hidden' }}>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
              }}
            >
              ManaVidya
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 11,
                color: 'var(--text-tertiary)',
                whiteSpace: 'nowrap',
                textTransform: 'capitalize',
              }}
            >
              {user.portal} Portal
            </p>
          </div>
        )}
      </div>

      {expanded && <PortalSwitcher />}
      {expanded && <ChildSwitcher />}
      {expanded && <SidebarSearch />}

      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 12px' }}>
        {sections.map((section) => {
          const visible = section.items.map(renderEntry).filter(Boolean);
          if (visible.length === 0) return null;
          return (
            <div key={section.label} style={{ marginBottom: 20 }}>
              {expanded && (
                <p
                  style={{
                    margin: '0 0 6px 12px',
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: 'var(--text-tertiary)',
                  }}
                >
                  {section.label}
                </p>
              )}
              {visible}
            </div>
          );
        })}
      </nav>

      {!isMobile && (
        <div style={{ padding: '0 12px 12px', display: 'flex' }}>
          <motion.button
            onClick={toggleSidebar}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
            style={{
              width: expanded ? '100%' : 40,
              height: 40,
              margin: expanded ? 0 : '0 auto',
              borderRadius: 10,
              border: '1px solid var(--border-default)',
              background: 'var(--bg-surface-1)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <motion.span
              animate={{ rotate: expanded ? 0 : 180 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex' }}
            >
              <ChevronLeft size={16} />
            </motion.span>
          </motion.button>
        </div>
      )}
    </motion.aside>
  );

  if (!isMobile) return content;

  return mobileDrawerOpen ? (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeMobileDrawer}
        style={{ position: 'fixed', inset: 0, background: 'var(--scrim)', zIndex: 400 }}
      />
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 500, width: 300 }}
      >
        {content}
      </motion.div>
    </>
  ) : null;
}
