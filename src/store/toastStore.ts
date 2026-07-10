import { create } from 'zustand';

export type ToastSeverity = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  severity: ToastSeverity;
  message: string;
}

const MAX_VISIBLE = 4;

interface ToastState {
  toasts: Toast[];
  push: (severity: ToastSeverity, message: string) => void;
  dismiss: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (severity, message) =>
    set((s) => ({
      toasts: [...s.toasts, { id: crypto.randomUUID(), severity, message }].slice(-MAX_VISIBLE),
    })),
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
