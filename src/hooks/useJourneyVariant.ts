import { useReducedMotion } from 'framer-motion';

export function useJourneyVariant(): 'reduced' | 'full' {
  const shouldReduce = useReducedMotion();
  return shouldReduce ? 'reduced' : 'full';
}
