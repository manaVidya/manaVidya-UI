import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '../../lib/motion';
import { GateScene, AboutSection } from './scenes';

/** Rendered instead of JourneyScene when useJourneyVariant() === 'reduced' (§3.5, §9). */
export function JourneySceneReduced() {
  return (
    <div style={{ background: '#09090F' }}>
      <section style={{ height: '60vh', position: 'relative' }}>
        <GateScene />
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
