import { useReducedMotion } from 'framer-motion';
import '../../theme/portalGradientBackground.css';

/**
 * Fixed, full-viewport ambient backdrop shared by every portal.
 *
 * Reads only `--portal-*` custom properties (set by `data-portal` on <html>,
 * see theme/tokens.css), so switching portals recolours the whole wash —
 * corner blobs and brush strokes alike — with zero JS re-render.
 *
 * The three stroke paths below are a fixed, hand-tuned arrangement (not
 * randomised per load — that would read as broken, not organic) so every
 * portal shares the exact same brushed-canvas geometry and only its colour
 * identity changes, per §12.1's "same mechanism, swap the tokens" approach.
 */
export function PortalGradientBackground() {
  const shouldReduce = useReducedMotion();

  return (
    <div
      className={`portal-gradient-bg ${shouldReduce ? '' : 'portal-gradient-bg--animated'}`}
      aria-hidden="true"
    >
      <svg
        className="portal-gradient-strokes"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
      >
        <defs>
          <filter id="portalStrokeBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="46" />
          </filter>
          <filter id="portalStrokeBlurSoft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="30" />
          </filter>
        </defs>
        <g filter="url(#portalStrokeBlur)">
          <path
            className="portal-stroke-a"
            d="M -120 640 C 220 420, 480 760, 780 500 S 1260 220, 1620 360"
            fill="none"
            strokeWidth="150"
            strokeLinecap="round"
          />
          <path
            className="portal-stroke-c"
            d="M -100 140 C 220 320, 560 60, 860 260 S 1280 540, 1580 700"
            fill="none"
            strokeWidth="110"
            strokeLinecap="round"
          />
        </g>
        <g filter="url(#portalStrokeBlurSoft)">
          <path
            className="portal-stroke-b"
            d="M 1540 90 C 1220 190, 1020 20, 700 170 S 180 130, -80 30"
            fill="none"
            strokeWidth="70"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}
