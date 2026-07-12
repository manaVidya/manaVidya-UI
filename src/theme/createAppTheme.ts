import { createTheme, type ThemeOptions, type Theme } from '@mui/material/styles';
import { PORTAL_PALETTES, type PortalKey } from './portalPalettes';
import { NEUTRAL, TEXT_INVERSE } from './neutralColors';

export function createAppTheme(portal: PortalKey, mode: 'dark' | 'light'): Theme {
  const scale = PORTAL_PALETTES[portal];
  const isDark = mode === 'dark';
  const neutral = isDark ? NEUTRAL.dark : NEUTRAL.light;

  const options: ThemeOptions = {
    palette: {
      mode,
      primary: {
        light: scale[300],
        main: scale[500],
        dark: scale[700],
        // Portal brand tones sit mid-bright in both themes — dark text reads on all of them.
        contrastText: TEXT_INVERSE,
      },
      background: {
        // MUI runs palette colours through alpha()/decomposeColor() at runtime (hover
        // overlays, disabled-state opacity), which only understands literal colour
        // formats — CSS custom properties throw. So the palette itself must stay
        // literal; theme/tokens.css's :root values are mirrored in neutralColors.ts.
        default: neutral.bgBase,
        paper: neutral.bgSubtle,
      },
      text: {
        primary: neutral.textPrimary,
        secondary: neutral.textSecondary,
      },
      divider: neutral.divider,
      success: { main: '#22C55E' },
      warning: { main: '#F59E0B' },
      error: { main: '#EF4444' },
      info: { main: '#3B82F6' },
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: '"Inter Variable", "Inter", system-ui, sans-serif',
      h1: { fontSize: '2rem', fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.015em' },
      h2: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.3, letterSpacing: '-0.01em' },
      h3: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.35, letterSpacing: '-0.005em' },
      h4: { fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.4 },
      h5: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.4 },
      h6: { fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.4, letterSpacing: '0.01em' },
      body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.65 },
      body2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.6 },
      caption: { fontSize: '0.75rem', fontWeight: 400, lineHeight: 1.5, letterSpacing: '0.02em' },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: '10px 24px',
            transition: 'transform 150ms cubic-bezier(0.22,1,0.36,1), box-shadow 150ms ease',
            '&:hover': { transform: 'translateY(-1px)' },
            '&:active': { transform: 'scale(0.97)' },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: '1px solid var(--border-default)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            transition: 'border-color 250ms ease, box-shadow 250ms ease',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-default)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 10,
              '&:hover fieldset': { borderColor: scale[500] },
              '&.Mui-focused fieldset': { borderColor: scale[500] },
            },
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          // Intentionally dark in both themes — a light tooltip on a light page reads
          // as another card, not a fleeting hint. Not a token miss.
          tooltip: {
            backgroundColor: 'rgba(20,21,36,0.95)',
            backdropFilter: 'blur(12px)',
            fontSize: 12,
            borderRadius: 8,
          },
        },
      },
      MuiBackdrop: {
        styleOverrides: {
          // Dialogs/drawers previously fell back to MUI's default 50%-black
          // backdrop, which barely dims the page — skeletons and spinners
          // behind an open dialog stayed clearly visible. Route it through
          // the app's own --scrim token so it matches the mobile drawer scrim.
          root: { backgroundColor: 'var(--scrim)' },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: 'thin',
            scrollbarColor: `${scale[500]} var(--bg-surface-2)`,
            '&::-webkit-scrollbar': { width: 6 },
            '&::-webkit-scrollbar-track': { background: 'var(--bg-surface-2)' },
            '&::-webkit-scrollbar-thumb': { background: scale[500], borderRadius: 3 },
          },
        },
      },
    },
  };

  return createTheme(options);
}
