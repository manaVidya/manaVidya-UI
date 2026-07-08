import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';
import { useAuth } from '../../hooks/useAuth';
import { NAVIGATION_CONFIG, type NavEntry } from '../../lib/navigationConfig';
import { useLayoutStore } from '../../hooks/useLayout';

interface FlatCommand {
  id: string;
  label: string;
  to: string;
  group: string;
}

function flattenNav(entries: NavEntry[], group: string): FlatCommand[] {
  const out: FlatCommand[] = [];
  for (const entry of entries) {
    if (entry.kind === 'item') {
      out.push({ id: entry.to, label: entry.label, to: entry.to, group });
    } else {
      for (const child of entry.children) {
        out.push({ id: child.to, label: `${entry.label} · ${child.label}`, to: child.to, group });
      }
    }
  }
  return out;
}

function findEntryByTo(sections: { items: NavEntry[] }[], to: string): NavEntry | undefined {
  for (const section of sections) {
    for (const entry of section.items) {
      if (entry.kind === 'item' && entry.to === to) return entry;
      if (entry.kind === 'accordion') {
        const child = entry.children.find((c) => c.to === to);
        if (child) return child;
      }
    }
  }
  return undefined;
}

export function CommandPalette() {
  const open = useLayoutStore((s) => s.commandPaletteOpen);
  const setOpen = useLayoutStore((s) => s.setCommandPaletteOpen);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { can } = usePermissions();
  const { user } = useAuth();

  function close() {
    setOpen(false);
    setQuery('');
  }

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (open) {
          setOpen(false);
          setQuery('');
        } else {
          setOpen(true);
        }
      }
      if (e.key === 'Escape') {
        setOpen(false);
        setQuery('');
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, setOpen]);

  const allCommands = useMemo(() => {
    if (!user) return [];
    const sections = NAVIGATION_CONFIG[user.portal];
    return sections.flatMap((section) => flattenNav(section.items, section.label));
  }, [user]);

  const filteredCommands = useMemo(() => {
    const bySearch = query.trim()
      ? allCommands.filter((c) => c.label.toLowerCase().includes(query.trim().toLowerCase()))
      : allCommands;
    return bySearch.filter((c) => {
      const original = findEntryByTo(user ? NAVIGATION_CONFIG[user.portal] : [], c.to);
      return !original?.rbacKey || can(original.rbacKey);
    });
  }, [allCommands, query, can, user]);

  const grouped = useMemo(() => {
    const map = new Map<string, FlatCommand[]>();
    for (const cmd of filteredCommands) {
      const list = map.get(cmd.group) ?? [];
      list.push(cmd);
      map.set(cmd.group, list);
    }
    return Array.from(map.entries());
  }, [filteredCommands]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'var(--scrim)',
              backdropFilter: 'blur(4px)',
              zIndex: 400,
            }}
          />
          <motion.div
            key="palette"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed',
              top: '16vh',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'min(640px, 90vw)',
              maxHeight: '64vh',
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--nav-glass-bg-strong)',
              backdropFilter: 'blur(40px)',
              borderRadius: 16,
              border: '1px solid var(--border-strong)',
              overflow: 'hidden',
              zIndex: 900,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '14px 18px',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <Search size={18} color="var(--text-tertiary)" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages and actions…"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: 15,
                }}
              />
              <kbd
                style={{
                  fontSize: 11,
                  color: 'var(--text-tertiary)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: 4,
                  padding: '2px 6px',
                }}
              >
                Esc
              </kbd>
            </div>
            <div style={{ overflowY: 'auto', padding: 8 }}>
              {grouped.length === 0 && (
                <p
                  style={{
                    padding: '24px 12px',
                    textAlign: 'center',
                    color: 'var(--text-tertiary)',
                    fontSize: 14,
                  }}
                >
                  No matches for &ldquo;{query}&rdquo;
                </p>
              )}
              {grouped.map(([group, commands]) => (
                <div key={group} style={{ marginBottom: 8 }}>
                  <p
                    style={{
                      margin: '8px 12px 4px',
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    {group}
                  </p>
                  {commands.map((cmd) => (
                    <button
                      key={cmd.id}
                      onClick={() => {
                        void navigate(cmd.to);
                        close();
                      }}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 12px',
                        borderRadius: 8,
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--text-primary)',
                        fontSize: 14,
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = 'var(--bg-surface-2)')
                      }
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      {cmd.label}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
