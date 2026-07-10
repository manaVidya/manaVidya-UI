/**
 * Real-photo manifest for the landing-page scroll story.
 *
 * Drop matching JPGs into `manaVidya-UI/public/journey/` with these exact
 * filenames and the scene upgrades from its placeholder gradient to the real
 * photo automatically — no code changes needed.
 *
 * Recommended: 2400×1350 (16:9), well-compressed JPG or WebP, under ~400KB
 * each. `focalPoint` controls `object-position` so the important part of the
 * photo (the gate sign, the kids, the teacher) stays in frame on narrow
 * viewports where the sides of a wide photo get cropped off.
 */
export interface JourneyPhoto {
  id: string;
  /** Root-relative path served from /public — see the folder note above. */
  src: string;
  alt: string;
  focalPoint: string;
  /** Shown (softly animated) until the real photo exists at `src`. */
  fallbackGradient: string;
}

export const JOURNEY_PHOTOS: Record<
  'gate' | 'playgroundAction' | 'playgroundEquipment' | 'classroom',
  JourneyPhoto
> = {
  gate: {
    id: 'gate',
    src: '/journey/gate.jpg',
    alt: 'Students walking through the school gate in the morning',
    focalPoint: '50% 35%',
    fallbackGradient: 'linear-gradient(160deg, #7EC0EE 0%, #A9D8F2 45%, #E8DEC6 100%)',
  },
  playgroundAction: {
    id: 'playgroundAction',
    src: '/journey/playground-action.jpg',
    alt: 'Students playing football together in the school playground',
    focalPoint: '50% 55%',
    fallbackGradient: 'linear-gradient(160deg, #C7B383 0%, #DCCB9E 55%, #A9C97E 100%)',
  },
  playgroundEquipment: {
    id: 'playgroundEquipment',
    src: '/journey/playground-play.jpg',
    alt: 'Children playing on the slide and swings',
    focalPoint: '50% 45%',
    fallbackGradient: 'linear-gradient(160deg, #DCCB9E 0%, #E8C97E 50%, #C7B383 100%)',
  },
  classroom: {
    id: 'classroom',
    src: '/journey/classroom.jpg',
    alt: 'A teacher at the blackboard with students seated at their desks',
    focalPoint: '50% 40%',
    fallbackGradient: 'linear-gradient(160deg, #F3EEDF 0%, #E8DFC6 55%, #C9B98C 100%)',
  },
};
