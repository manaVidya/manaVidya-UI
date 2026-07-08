import { useState, type ElementType, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface SidebarNavAccordionProps {
  label: string;
  icon: ElementType;
  expanded: boolean;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function SidebarNavAccordion({
  label,
  icon: Icon,
  expanded,
  defaultOpen,
  children,
}: SidebarNavAccordionProps) {
  const [open, setOpen] = useState(!!defaultOpen);

  return (
    <div style={{ marginBottom: 2 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          width: '100%',
          padding: '10px 12px',
          borderRadius: 10,
          border: 'none',
          background: 'transparent',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
        }}
      >
        <Icon size={18} style={{ flexShrink: 0 }} />
        {expanded && (
          <>
            <span style={{ fontSize: 14, flex: 1, textAlign: 'left' }}>{label}</span>
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex' }}
            >
              <ChevronDown size={14} />
            </motion.span>
          </>
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
