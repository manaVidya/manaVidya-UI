import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '../../lib/motion';
import { AboutSection } from './scenes';

/** Final page section — sits after the feature showcase as the actual closing CTA.
 *  `transparentBg` lets a page behind it (e.g. the demo page's fixed gradient wash)
 *  show through instead of this section's own solid fill. */
export function ClosingCTA({ transparentBg = false }: { transparentBg?: boolean }) {
  return (
    <motion.section
      variants={staggerContainer(0.1)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 40,
        padding: '120px 24px',
        background: transparentBg ? 'transparent' : '#09090F',
      }}
    >
      <motion.div variants={fadeIn}>
        <AboutSection />
      </motion.div>
      <motion.div variants={fadeIn}>
        <Button component={Link} to="/login" variant="contained" size="large">
          Get started
        </Button>
      </motion.div>
    </motion.section>
  );
}
