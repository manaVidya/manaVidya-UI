import { useState } from 'react';
import { Search } from 'lucide-react';
import { useLayoutStore } from '../../hooks/useLayout';

export function SidebarSearch() {
  const [focused, setFocused] = useState(false);
  const setCommandPaletteOpen = useLayoutStore((s) => s.setCommandPaletteOpen);

  return (
    <div style={{ padding: '0 16px 12px' }}>
      <button
        onClick={() => setCommandPaletteOpen(true)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          width: '100%',
          padding: '8px 10px',
          borderRadius: 8,
          border: `1px solid ${focused ? 'var(--portal-500)' : 'var(--border-default)'}`,
          background: 'var(--bg-surface-1)',
          color: 'var(--text-tertiary)',
          fontSize: 13,
          cursor: 'pointer',
        }}
      >
        <Search size={14} />
        <span>Search modules…</span>
        <kbd
          style={{
            marginLeft: 'auto',
            fontSize: 10,
            border: '1px solid var(--border-strong)',
            borderRadius: 4,
            padding: '1px 5px',
          }}
        >
          ⌘K
        </kbd>
      </button>
    </div>
  );
}
