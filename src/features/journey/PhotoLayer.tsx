import { useState } from 'react';
import { motion, type MotionValue } from 'framer-motion';
import type { JourneyPhoto } from './journeyPhotos';

interface PhotoLayerProps {
  photo: JourneyPhoto;
  /** Scroll-linked motion values computed by the parent scene. */
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
  x?: MotionValue<string>;
  y?: MotionValue<string>;
  /** Darkens toward the bottom so overlaid text stays legible on any photo. */
  scrimStrength?: number;
  zIndex: number;
  priority?: boolean;
}

/**
 * Full-bleed photo layer with a Ken Burns zoom/pan (driven by scroll) and a
 * legibility scrim. Falls back to a themed gradient — not a broken-image
 * icon — until the real photo lands at `photo.src` (see journeyPhotos.ts).
 */
export function PhotoLayer({
  photo,
  opacity,
  scale,
  x,
  y,
  scrimStrength = 0.55,
  zIndex,
  priority = false,
}: PhotoLayerProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const showPhoto = loaded && !errored;

  return (
    <motion.div style={{ opacity, position: 'absolute', inset: 0, zIndex, overflow: 'hidden' }}>
      <motion.div style={{ scale, x, y, position: 'absolute', inset: '-4%' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: photo.fallbackGradient,
            opacity: showPhoto ? 0 : 1,
            transition: 'opacity 0.6s ease',
          }}
        />
        <img
          src={photo.src}
          alt={photo.alt}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: photo.focalPoint,
            opacity: showPhoto ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        />
      </motion.div>

      {/* Legibility scrim — stronger at the bottom, where copy sits. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, rgba(9,9,15,${scrimStrength * 0.35}) 0%, rgba(9,9,15,${scrimStrength * 0.15}) 35%, rgba(9,9,15,${scrimStrength}) 100%)`,
        }}
      />
    </motion.div>
  );
}
