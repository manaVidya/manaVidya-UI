import { useJourneyVariant } from '../../hooks/useJourneyVariant';
import { JourneyScene } from './JourneyScene';
import { JourneySceneReduced } from './JourneySceneReduced';

/** Public portal hero — picks the full cinematic scroll or the reduced-motion fallback (§3.5, §9). */
export function VidyaJourney() {
  const variant = useJourneyVariant();
  return variant === 'reduced' ? <JourneySceneReduced /> : <JourneyScene />;
}
