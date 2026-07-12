import { useEffect, useRef } from 'react';
import './loginAura.css';

/**
 * Mouse-reactive spotlight for the login page: a faint dot grid that lights
 * up in a circle around the cursor, sitting over the app's existing
 * PortalGradientBackground wash (see RootLayout).
 *
 * Cursor position is written straight to two CSS custom properties via a
 * ref — never through React state — so tracking the mouse costs a single
 * style write per animation frame, no re-renders. Disabled outright for
 * touch/coarse pointers (nothing to track, and it'd just burn battery) and
 * for prefers-reduced-motion, where loginAura.css falls back to a static,
 * low-opacity grid instead of hiding the page's texture entirely.
 */
export function LoginAura() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      root.classList.add('login-aura--static');
      return;
    }

    let frame = 0;
    function handleMove(e: MouseEvent) {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        root?.style.setProperty('--aura-x', `${e.clientX}px`);
        root?.style.setProperty('--aura-y', `${e.clientY}px`);
      });
    }

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={rootRef} className="login-aura" aria-hidden="true">
      <div className="login-aura__glow" />
      <div className="login-aura__grid" />
    </div>
  );
}
