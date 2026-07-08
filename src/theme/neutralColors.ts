/**
 * Literal (non-CSS-variable) copies of the neutral tokens in theme/tokens.css.
 *
 * MUI's palette object feeds into `alpha()` / `decomposeColor()` at runtime
 * (button hover overlays, ripple effects, disabled-state opacity) — those
 * utilities only parse literal colour formats (#hex, rgb(), hsl(), ...) and
 * throw on a raw `var(--x)` string. So the *palette* itself must stay
 * literal; everything else (styleOverrides CSS strings, sx props, plain
 * inline styles) can safely reference the CSS custom properties directly.
 *
 * Keep these values in sync with the corresponding entries in tokens.css.
 */
export const NEUTRAL = {
  dark: {
    bgBase: '#09090F',
    bgSubtle: '#0D0E1A',
    textPrimary: '#E8E9F3',
    textSecondary: '#9A9BBF',
    divider: 'rgba(255,255,255,0.10)',
  },
  light: {
    bgBase: '#F5F5FA',
    bgSubtle: '#EEEEF7',
    textPrimary: '#131320',
    textSecondary: '#4A4B6A',
    divider: 'rgba(0,0,0,0.10)',
  },
} as const;

export const TEXT_INVERSE = '#09090F';
