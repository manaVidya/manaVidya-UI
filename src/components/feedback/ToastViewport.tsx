import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { useToastStore, type Toast, type ToastSeverity } from '../../store/toastStore';

const AUTO_DISMISS_MS = 4500;

const SEVERITY_META: Record<
  ToastSeverity,
  { icon: typeof CheckCircle2; color: string; tint: string; label: string }
> = {
  success: {
    icon: CheckCircle2,
    color: 'var(--status-success-500)',
    tint: 'var(--toast-success-tint)',
    label: 'Success',
  },
  error: {
    icon: XCircle,
    color: 'var(--status-error-500)',
    tint: 'var(--toast-error-tint)',
    label: 'Error',
  },
  warning: {
    icon: AlertTriangle,
    color: 'var(--status-warning-500)',
    tint: 'var(--toast-warning-tint)',
    label: 'Warning',
  },
  info: {
    icon: Info,
    color: 'var(--status-info-500)',
    tint: 'var(--toast-info-tint)',
    label: 'Info',
  },
};

function ToastCard({ toast }: { toast: Toast }) {
  const dismiss = useToastStore((s) => s.dismiss);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const meta = SEVERITY_META[toast.severity];
  const Icon = meta.icon;

  function startTimer() {
    timerRef.current = setTimeout(() => dismiss(toast.id), AUTO_DISMISS_MS);
  }

  function clearTimer() {
    if (timerRef.current) clearTimeout(timerRef.current);
  }

  useEffect(() => {
    startTimer();
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onMouseEnter={clearTimer}
      onMouseLeave={startTimer}
      role="status"
      aria-live={toast.severity === 'error' ? 'assertive' : 'polite'}
      style={{
        pointerEvents: 'auto',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        width: '100%',
        maxWidth: 380,
        padding: '14px 16px',
        borderRadius: 'var(--radius-lg)',
        background: `linear-gradient(135deg, ${meta.tint}, transparent 70%), var(--nav-glass-bg)`,
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: `1px solid ${meta.color}`,
        borderLeft: `3px solid ${meta.color}`,
        boxShadow: 'var(--nav-shadow)',
      }}
    >
      <Icon size={20} color={meta.color} style={{ flexShrink: 0, marginTop: 1 }} aria-hidden />
      <p
        style={{
          margin: 0,
          flex: 1,
          fontSize: 13.5,
          lineHeight: 1.45,
          color: 'var(--text-primary)',
        }}
      >
        {toast.message}
      </p>
      <button
        onClick={() => dismiss(toast.id)}
        aria-label="Dismiss notification"
        style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 22,
          height: 22,
          borderRadius: 6,
          border: 'none',
          background: 'transparent',
          color: 'var(--text-tertiary)',
          cursor: 'pointer',
        }}
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

/** Global toast stack — mounted once in RootLayout so it persists across every route. */
export function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 700, // matches --z-toast in tokens.css
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        pointerEvents: 'none',
        width: 'min(380px, calc(100vw - 40px))',
      }}
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
