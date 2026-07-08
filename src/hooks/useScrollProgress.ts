import { useScroll, useSpring } from 'framer-motion';
import { useRef } from 'react';

export function useScrollProgress() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.0005,
  });

  return { containerRef, smoothProgress, rawProgress: scrollYProgress };
}
