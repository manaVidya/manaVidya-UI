import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { ElementType } from 'react';
import { Tooltip } from '@mui/material';

interface SidebarNavItemProps {
  to: string;
  label: string;
  icon: ElementType;
  expanded: boolean;
  active: boolean;
  nested?: boolean;
  badge?: number;
}

export function SidebarNavItem({
  to,
  label,
  icon: Icon,
  expanded,
  active,
  nested,
  badge,
}: SidebarNavItemProps) {
  const item = (
    <motion.div
      whileHover={{ x: 4, backgroundColor: 'var(--bg-surface-2)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      style={{ borderRadius: 10, marginBottom: 2, position: 'relative' }}
    >
      <NavLink
        to={to}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: nested ? '8px 12px 8px 32px' : '10px 12px',
          borderRadius: 10,
          textDecoration: 'none',
          color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
          borderLeft: active ? '3px solid var(--portal-500)' : '3px solid transparent',
          background: active ? 'var(--bg-surface-2)' : 'transparent',
        }}
      >
        <Icon size={18} style={{ flexShrink: 0 }} />
        {expanded && (
          <span
            style={{ fontSize: 14, fontWeight: active ? 600 : 400, whiteSpace: 'nowrap', flex: 1 }}
          >
            {label}
          </span>
        )}
        {!!badge && expanded && (
          <span
            style={{
              minWidth: 18,
              height: 18,
              borderRadius: 9,
              padding: '0 5px',
              fontSize: 10,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--status-error-500)',
              color: '#fff',
              flexShrink: 0,
            }}
          >
            {badge}
          </span>
        )}
        {!!badge && !expanded && (
          <span
            style={{
              position: 'absolute',
              top: 4,
              right: 4,
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--status-error-500)',
            }}
          />
        )}
      </NavLink>
    </motion.div>
  );

  if (!expanded) {
    return (
      <Tooltip title={label} placement="right">
        {item}
      </Tooltip>
    );
  }
  return item;
}
