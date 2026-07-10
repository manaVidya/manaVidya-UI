import { useToastStore } from '../store/toastStore';

/** Manual toast trigger for use outside of the automatic API success/error wiring in api.ts. */
export function useToast() {
  const push = useToastStore((s) => s.push);

  return {
    success: (message: string) => push('success', message),
    error: (message: string) => push('error', message),
    warning: (message: string) => push('warning', message),
    info: (message: string) => push('info', message),
  };
}
