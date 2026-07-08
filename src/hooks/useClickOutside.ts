import { useEffect, type RefObject } from 'react';

/**
 * Closes a popover/dropdown on an outside click or Escape. Needed because the
 * sidebar (and anything inside it) persists across route changes within a
 * portal — without this, an opened dropdown stays open while the user
 * navigates to other pages, floating over unrelated content.
 */
export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  onDismiss: () => void,
) {
  useEffect(() => {
    if (!active) return;

    function handlePointerDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onDismiss();
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onDismiss();
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [active, ref, onDismiss]);
}
