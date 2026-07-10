import { useTransform } from 'framer-motion';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { JOURNEY_PHOTOS } from './journeyPhotos';
import { PhotoLayer } from './PhotoLayer';
import { JourneyCopy } from './JourneyCopy';

export function JourneyScene() {
  const { containerRef, smoothProgress } = useScrollProgress();

  // === Beat 1: Gate — 0% to 20% — visible immediately on load, no fade-in from blank ===
  const gateOpacity = useTransform(smoothProgress, [0, 0.18, 0.2], [1, 1, 0]);
  const gateScale = useTransform(smoothProgress, [0, 0.2], [1, 1.1]);
  const gateX = useTransform(smoothProgress, [0, 0.2], ['0%', '-3%']);
  const gateCopyOpacity = useTransform(smoothProgress, [0, 0.15, 0.18], [1, 1, 0]);
  const gateCopyY = useTransform(smoothProgress, [0, 0.02], [0, 0]);

  // === Beat 2: Playground — football — 19% to 40% ===
  const actionOpacity = useTransform(smoothProgress, [0.19, 0.22, 0.37, 0.4], [0, 1, 1, 0]);
  const actionScale = useTransform(smoothProgress, [0.19, 0.4], [1, 1.15]);
  const actionX = useTransform(smoothProgress, [0.19, 0.4], ['0%', '3%']);
  const actionCopyOpacity = useTransform(smoothProgress, [0.23, 0.28, 0.35, 0.38], [0, 1, 1, 0]);
  const actionCopyY = useTransform(smoothProgress, [0.23, 0.28], [40, 0]);

  // === Beat 3: Playground equipment — 39% to 60% ===
  const playOpacity = useTransform(smoothProgress, [0.39, 0.42, 0.57, 0.6], [0, 1, 1, 0]);
  const playScale = useTransform(smoothProgress, [0.39, 0.6], [1.03, 1.15]);
  const playY = useTransform(smoothProgress, [0.39, 0.6], ['0%', '-3%']);
  const playCopyOpacity = useTransform(smoothProgress, [0.43, 0.48, 0.55, 0.58], [0, 1, 1, 0]);
  const playCopyY = useTransform(smoothProgress, [0.43, 0.48], [40, 0]);

  // === Beat 4: Classroom — 59% to 100% (holds to the end, no beat after it) ===
  const classroomOpacity = useTransform(smoothProgress, [0.59, 0.62, 1], [0, 1, 1]);
  const classroomScale = useTransform(smoothProgress, [0.59, 1], [1, 1.25]);
  const classroomX = useTransform(smoothProgress, [0.59, 1], ['0%', '-2%']);
  const classroomCopyOpacity = useTransform(smoothProgress, [0.63, 0.68, 0.92, 0.97], [0, 1, 1, 0]);
  const classroomCopyY = useTransform(smoothProgress, [0.63, 0.68], [40, 0]);

  return (
    <div ref={containerRef} style={{ height: '480vh', position: 'relative' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          background: '#09090F',
        }}
      >
        <PhotoLayer
          photo={JOURNEY_PHOTOS.gate}
          opacity={gateOpacity}
          scale={gateScale}
          x={gateX}
          zIndex={1}
          priority
        />
        <JourneyCopy
          opacity={gateCopyOpacity}
          y={gateCopyY}
          eyebrow="ManaVidya"
          headline="Every school day starts here."
          subtext="One connected platform for admins, teachers, parents, and students."
          zIndex={2}
        />

        <PhotoLayer
          photo={JOURNEY_PHOTOS.playgroundAction}
          opacity={actionOpacity}
          scale={actionScale}
          x={actionX}
          zIndex={3}
        />
        <JourneyCopy
          opacity={actionCopyOpacity}
          y={actionCopyY}
          eyebrow="Attendance"
          headline="Marked once. Seen instantly."
          subtext="Teachers mark attendance in seconds — parents see it the same day, no phone calls needed."
          zIndex={4}
        />

        <PhotoLayer
          photo={JOURNEY_PHOTOS.playgroundEquipment}
          opacity={playOpacity}
          scale={playScale}
          y={playY}
          zIndex={5}
        />
        <JourneyCopy
          opacity={playCopyOpacity}
          y={playCopyY}
          eyebrow="Every child"
          headline="From the swings to the syllabus."
          subtext="One profile per student — assignments, attendance, and results, all in one place."
          zIndex={6}
        />

        <PhotoLayer
          photo={JOURNEY_PHOTOS.classroom}
          opacity={classroomOpacity}
          scale={classroomScale}
          x={classroomX}
          zIndex={7}
        />
        <JourneyCopy
          opacity={classroomCopyOpacity}
          y={classroomCopyY}
          eyebrow="In the classroom"
          headline="Every lesson. Every mark. Never lost."
          subtext="Teachers grade once — results reach parents and students the same day."
          zIndex={8}
        />
      </div>
    </div>
  );
}
