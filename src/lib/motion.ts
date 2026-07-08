import { type Variants, type Transition } from 'framer-motion';

/** Easing curves — Section 2.6 of the ManaVidya UI/UX spec */
export const EASE = {
  linear: [0, 0, 1, 1] as const,
  in: [0.4, 0, 1, 1] as const,
  out: [0, 0, 0.2, 1] as const,
  inOut: [0.4, 0, 0.2, 1] as const,
  spring: [0.22, 1, 0.36, 1] as const,
  bounce: [0.34, 1.56, 0.64, 1] as const,
  cinematic: [0.16, 1, 0.3, 1] as const,
};

/** Duration tokens (seconds) — Section 2.6 */
export const DURATION = {
  instant: 0.05,
  fast: 0.15,
  normal: 0.25,
  moderate: 0.35,
  slow: 0.5,
  slower: 0.7,
  cinematic: 1.2,
};

export const springTransition: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 24,
};

/** Fade in from transparent */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.normal, ease: EASE.inOut } },
  exit: { opacity: 0, transition: { duration: DURATION.fast, ease: EASE.in } },
};

/** Slide up from below + fade in */
export const slideUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.moderate, ease: EASE.spring } },
  exit: { opacity: 0, y: 12, transition: { duration: DURATION.fast, ease: EASE.in } },
};

/** Slide in from the left */
export const slideInFromLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: DURATION.moderate, ease: EASE.spring } },
};

/** Slide in from the right */
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: DURATION.normal, ease: EASE.spring } },
  exit: { opacity: 0, x: -20, transition: { duration: DURATION.fast, ease: EASE.in } },
};

/** Scale in + fade */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: DURATION.normal, ease: EASE.spring } },
};

/**
 * Parent wrapper — staggers children animations.
 * Wrap a list container with this, then each child with slideUp / fadeIn.
 */
export const staggerChildren: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

/** Function form — customisable stagger interval, per spec §2.8 */
export function staggerContainer(staggerChildrenSeconds = 0.08): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: staggerChildrenSeconds } },
  };
}

/** Full-page route transition */
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.99 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DURATION.moderate, ease: EASE.spring },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.99,
    transition: { duration: DURATION.normal, ease: EASE.in },
  },
};

/** Scale on hover / tap — use as whileHover / whileTap prop values */
export const scaleOnHover = {
  whileHover: { scale: 1.03, transition: { duration: 0.2 } },
  whileTap: { scale: 0.97 },
};

/** Pulse glow animation — use as animate prop */
export const pulseGlow = {
  animate: {
    boxShadow: [
      '0 0 0px rgba(108,99,255,0)',
      '0 0 20px rgba(108,99,255,0.4)',
      '0 0 0px rgba(108,99,255,0)',
    ],
    transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' as const },
  },
};

export const shakeAnimation = {
  x: [0, -8, 8, -4, 4, 0],
  transition: { duration: 0.4 },
};

export function collapseWidth(expandedPx: number, collapsedPx: number): Variants {
  return {
    expanded: { width: expandedPx, transition: { duration: DURATION.moderate, ease: EASE.spring } },
    collapsed: {
      width: collapsedPx,
      transition: { duration: DURATION.moderate, ease: EASE.spring },
    },
  };
}
