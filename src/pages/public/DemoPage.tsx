import { useEffect } from 'react';
import { Box } from '@mui/material';
import { FloatingNav } from '../../features/public/FloatingNav';
import { DemoOverview } from '../../features/public/DemoOverview';
import { ClosingCTA } from '../../features/journey/ClosingCTA';
import { SiteFooter } from '../../features/public/SiteFooter';
import '../../features/public/demoOverview.css';

// Same colors as .demo-gradient-wash in demoOverview.css, dimmed with a dark overlay
// instead of blurred (filter/blur doesn't apply to a plain <body> background) — used
// only for the sliver of rubber-band overscroll past the top/bottom edge, so that
// gap shows the gradient's colors too, not a flat fallback color.
const OVERSCROLL_GRADIENT =
  'linear-gradient(rgba(9,9,15,0.78), rgba(9,9,15,0.78)), ' +
  'conic-gradient(from 0deg at 50% 50%, #6c63ff, #ff3d68, #ffb300, #00d4c8, #6c63ff)';

/** Simple, single-scroll overview of what ManaVidya does — a lighter alternative
 *  to the full scroll-driven journey on the main landing page. */
export default function DemoPage() {
  // Rubber-band/overscroll past the top or bottom edge reveals the real <body>
  // background for a moment — pin it to this page's gradient while mounted, otherwise
  // that overscroll gap shows whatever flat color the app's current theme has.
  useEffect(() => {
    const previousBg = document.body.style.background;
    document.body.style.background = OVERSCROLL_GRADIENT;
    return () => {
      document.body.style.background = previousBg;
    };
  }, []);

  // No background color on this wrapper on purpose — a positioned ancestor's own
  // background paints *above* a negative-z-index descendant (a classic stacking
  // pitfall), which would hide the wash below completely. The dark base color lives
  // on <body> itself (set above), so paint order is: body color → fixed wash → content.
  return (
    <Box sx={{ position: 'relative' }}>
      {/* One gradient wash fixed behind the entire page — hero, sections, and the
          shared ClosingCTA/SiteFooter all sit on top of this, transparent, so it
          reads as one continuous background instead of breaking at section edges. */}
      <div className="demo-gradient-wash demo-gradient-wash--fixed" aria-hidden />

      <FloatingNav />
      <DemoOverview />
      <ClosingCTA transparentBg />
      <SiteFooter transparentBg />
    </Box>
  );
}
