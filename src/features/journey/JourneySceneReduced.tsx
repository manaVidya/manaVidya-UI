import { motion, useMotionValue } from 'framer-motion';
import { fadeIn, staggerContainer } from '../../lib/motion';
import { JOURNEY_PHOTOS } from './journeyPhotos';
import { PhotoLayer } from './PhotoLayer';
import { AboutSection } from './scenes';

/** Rendered instead of JourneyScene when useJourneyVariant() === 'reduced' (§3.5, §9). */
export function JourneySceneReduced() {
  const staticOpacity = useMotionValue(1);
  const staticScale = useMotionValue(1);

  return (
    <div style={{ background: '#09090F' }}>
      <section style={{ height: '70vh', position: 'relative' }}>
        <PhotoLayer
          photo={JOURNEY_PHOTOS.gate}
          opacity={staticOpacity}
          scale={staticScale}
          zIndex={1}
          priority
          scrimStrength={0.4}
        />
      </section>
      <motion.section
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 0',
        }}
      >
        <motion.div variants={fadeIn}>
          <AboutSection />
        </motion.div>
      </motion.section>
    </div>
  );
}
