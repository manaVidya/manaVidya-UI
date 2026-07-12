import { useRef, type ReactNode, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import './demoOverview.css';

interface SpotlightCardProps {
  children: ReactNode;
  /** Tints both the hover spotlight and the pop-out glow shadow. */
  accentColor: string;
  style?: CSSProperties;
}

/** Card with a mouse-tracking spotlight (cursor position written straight to the DOM via
 *  a ref, never through React state) plus a pronounced hover "pop" — scale, lift, and a
 *  colored glow shadow in the card's own accent. Same technique as the login page's
 *  cursor-reactive aura, just localized to one card instead of the whole viewport. */
export function SpotlightCard({ children, accentColor, style }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--sx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--sy', `${e.clientY - rect.top}px`);
  }

  return (
    <motion.div
      ref={ref}
      className="demo-spotlight-card"
      onMouseMove={handleMouseMove}
      whileHover={{
        y: -10,
        scale: 1.04,
        boxShadow: `0 20px 48px -12px ${accentColor}55`,
      }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      style={{
        ['--spotlight-color' as string]: `${accentColor}33`,
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}
