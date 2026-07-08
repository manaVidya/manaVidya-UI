import { useRef, useState } from 'react';
import { ChevronDown, UserRound } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useClickOutside } from '../../hooks/useClickOutside';

/**
 * Lets a parent with more than one child linked to the account switch which
 * child's data (attendance, results, fees, ...) the portal is currently
 * showing. Renders a static "viewing: {child}" chip when there's only one.
 */
export function ChildSwitcher({ compact = false }: { compact?: boolean }) {
  const { user, activeChild, setActiveChild } = useAuth();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  useClickOutside(wrapperRef, open, () => setOpen(false));

  if (!user || user.portal !== 'parent' || !user.children || user.children.length === 0)
    return null;

  const hasMultiple = user.children.length > 1;

  return (
    <div ref={wrapperRef} style={{ position: 'relative', padding: compact ? 0 : '0 16px 12px' }}>
      <button
        onClick={() => hasMultiple && setOpen((o) => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          width: '100%',
          padding: '8px 10px',
          borderRadius: 8,
          border: '1px solid var(--border-default)',
          background: 'var(--bg-surface-1)',
          color: 'var(--text-primary)',
          fontSize: 13,
          cursor: hasMultiple ? 'pointer' : 'default',
        }}
      >
        <UserRound size={15} color="var(--portal-400)" style={{ flexShrink: 0 }} />
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textAlign: 'left',
            flex: 1,
          }}
        >
          {activeChild
            ? `${activeChild.name} · ${activeChild.className}-${activeChild.section}`
            : 'Select child'}
        </span>
        {hasMultiple && (
          <ChevronDown
            size={14}
            style={{
              transform: open ? 'rotate(180deg)' : undefined,
              transition: 'transform 150ms ease',
            }}
          />
        )}
      </button>

      {open && hasMultiple && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: compact ? 0 : 16,
            right: compact ? 0 : 16,
            background: 'var(--nav-glass-bg-strong)',
            backdropFilter: 'blur(24px)',
            border: '1px solid var(--border-default)',
            borderRadius: 10,
            overflow: 'hidden',
            zIndex: 200,
          }}
        >
          {user.children.map((child) => (
            <button
              key={child.id}
              onClick={() => {
                setActiveChild(child.id);
                setOpen(false);
              }}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '9px 12px',
                border: 'none',
                background: child.id === user.activeChildId ? 'var(--bg-surface-2)' : 'transparent',
                color: 'var(--text-primary)',
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              {child.name}{' '}
              <span style={{ color: 'var(--text-tertiary)' }}>
                · {child.className}-{child.section}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
