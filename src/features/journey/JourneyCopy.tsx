import { motion, type MotionValue } from 'framer-motion';

interface JourneyCopyProps {
  opacity: MotionValue<number>;
  y: MotionValue<number>;
  eyebrow: string;
  headline: string;
  subtext: string;
  zIndex: number;
}

/** Bottom-left animated pop-in copy block, overlaid on a PhotoLayer. */
export function JourneyCopy({ opacity, y, eyebrow, headline, subtext, zIndex }: JourneyCopyProps) {
  return (
    <motion.div
      style={{
        opacity,
        y,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: '10%',
        zIndex,
        display: 'flex',
        justifyContent: 'center',
        padding: '0 24px',
        pointerEvents: 'none',
      }}
    >
      <div style={{ maxWidth: 640, textAlign: 'center' }}>
        <p
          style={{
            margin: '0 0 10px',
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#8FCBEA',
            textShadow: '0 2px 12px rgba(0,0,0,0.5)',
          }}
        >
          {eyebrow}
        </p>
        <h2
          style={{
            margin: '0 0 12px',
            fontSize: 'clamp(28px, 4.2vw, 48px)',
            fontWeight: 800,
            lineHeight: 1.15,
            color: '#FFFFFF',
            textShadow: '0 4px 24px rgba(0,0,0,0.55)',
          }}
        >
          {headline}
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: 'clamp(15px, 1.6vw, 19px)',
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.88)',
            textShadow: '0 2px 14px rgba(0,0,0,0.5)',
          }}
        >
          {subtext}
        </p>
      </div>
    </motion.div>
  );
}
