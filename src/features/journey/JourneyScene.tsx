import { motion, useTransform } from 'framer-motion';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import {
  SkyLayer,
  GateScene,
  GateLeafLeft,
  GateLeafRight,
  PlaygroundScene,
  VerandaScene,
  ClassroomDoor,
  ClassSignboard,
  ClassroomInterior,
  AboutSection,
} from './scenes';

export function JourneyScene() {
  const { containerRef, smoothProgress } = useScrollProgress();

  // === Scene 1: Gate (0%–12%) ===
  const gateLeftX = useTransform(smoothProgress, [0, 0.12], ['0%', '-85%']);
  const gateRightX = useTransform(smoothProgress, [0, 0.12], ['0%', '85%']);
  const cameraScale = useTransform(smoothProgress, [0, 0.12], [1, 1.06]);
  const gateOpacity = useTransform(smoothProgress, [0, 0.14, 0.16], [1, 1, 0]);

  // === Scene 2: Courtyard & Playground (12%–30%) ===
  const playgroundOpacity = useTransform(smoothProgress, [0.13, 0.16, 0.28, 0.3], [0, 1, 1, 0]);
  const playgroundY = useTransform(smoothProgress, [0.12, 0.3], ['4%', '-8%']);

  // === Scene 3: Veranda Walk (30%–50%) ===
  const verandaOpacity = useTransform(smoothProgress, [0.29, 0.32, 0.48, 0.5], [0, 1, 1, 0]);
  const verandaScale = useTransform(smoothProgress, [0.3, 0.5], [1, 1.35]);

  // === Scene 4: Classroom Door (50%–66%) ===
  const signboardOpacity = useTransform(smoothProgress, [0.5, 0.55], [0, 1]);
  const doorRotateY = useTransform(smoothProgress, [0.55, 0.66], [0, -85]);
  const doorSceneOpacity = useTransform(smoothProgress, [0.49, 0.52, 0.65, 0.67], [0, 1, 1, 0]);

  // === Scene 5: Classroom Interior (66%–86%) ===
  const interiorOpacity = useTransform(smoothProgress, [0.64, 0.68], [0, 1]);
  const benchZoom = useTransform(smoothProgress, [0.68, 0.86], [1, 1.9]);
  const sceneBlur = useTransform(
    smoothProgress,
    [0.78, 0.82, 0.84, 0.86],
    ['blur(0px)', 'blur(12px)', 'blur(12px)', 'blur(0px)'],
  );

  // === Scene 6: About Content (86%–100%) ===
  const aboutY = useTransform(smoothProgress, [0.86, 1.0], ['60px', '0px']);
  const aboutOpacity = useTransform(smoothProgress, [0.86, 0.93], [0, 1]);

  return (
    <div ref={containerRef} style={{ height: '700vh', position: 'relative' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          background: '#8FCBEA',
        }}
      >
        <motion.div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          <SkyLayer />
        </motion.div>

        <motion.div
          style={{
            opacity: gateOpacity,
            scale: cameraScale,
            position: 'absolute',
            inset: 0,
            zIndex: 2,
          }}
        >
          <GateScene />
          <motion.div style={{ x: gateLeftX, position: 'absolute', left: '27%', bottom: '8%' }}>
            <GateLeafLeft />
          </motion.div>
          <motion.div style={{ x: gateRightX, position: 'absolute', right: '27%', bottom: '8%' }}>
            <GateLeafRight />
          </motion.div>
        </motion.div>

        <motion.div
          style={{
            opacity: playgroundOpacity,
            y: playgroundY,
            position: 'absolute',
            inset: 0,
            zIndex: 3,
          }}
        >
          <PlaygroundScene />
        </motion.div>

        <motion.div
          style={{
            opacity: verandaOpacity,
            scale: verandaScale,
            position: 'absolute',
            inset: 0,
            zIndex: 4,
          }}
        >
          <VerandaScene />
        </motion.div>

        <motion.div
          style={{
            opacity: doorSceneOpacity,
            position: 'absolute',
            inset: 0,
            zIndex: 5,
            background: '#E4D9BE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ position: 'relative' }}>
            <motion.div
              style={{
                opacity: signboardOpacity,
                position: 'absolute',
                top: -84,
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              <ClassSignboard />
            </motion.div>
            <motion.div
              style={{
                rotateY: doorRotateY,
                transformOrigin: 'left center',
                transformStyle: 'preserve-3d',
              }}
            >
              <ClassroomDoor />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          style={{
            opacity: interiorOpacity,
            scale: benchZoom,
            filter: sceneBlur,
            position: 'absolute',
            inset: 0,
            zIndex: 6,
          }}
        >
          <ClassroomInterior />
        </motion.div>

        <motion.div
          style={{
            opacity: aboutOpacity,
            y: aboutY,
            position: 'absolute',
            inset: 0,
            zIndex: 7,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#09090F',
          }}
        >
          <AboutSection />
        </motion.div>
      </div>
    </div>
  );
}
