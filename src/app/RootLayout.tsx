import { Outlet, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect, useMemo } from 'react';
import { useAuthStore } from '../store/authStore';
import { createAppTheme } from '../theme/createAppTheme';
import type { PortalKey as ThemePortalKey } from '../theme/portalPalettes';
import { PortalGradientBackground } from '../components/foundation/PortalGradientBackground';
import { ToastViewport } from '../components/feedback/ToastViewport';

function resolvePortalFromPath(pathname: string): ThemePortalKey {
  if (pathname.startsWith('/admin')) return 'admin';
  if (pathname.startsWith('/teacher')) return 'teacher';
  if (pathname.startsWith('/parent')) return 'parent';
  if (pathname.startsWith('/student')) return 'student';
  return 'public';
}

/**
 * Root layout — resolves the active portal from the route, drives the MUI
 * theme factory (§2.8) and sets data-portal/data-theme on <html> so every
 * CSS-variable-driven surface (glass panels, gradient wash, nav bars)
 * recolours automatically, per §12.
 */
export function RootLayout() {
  const { pathname } = useLocation();
  const themeMode = useAuthStore((s) => s.themeMode);
  const portal = resolvePortalFromPath(pathname);
  const theme = useMemo(() => createAppTheme(portal, themeMode), [portal, themeMode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-portal', portal);
  }, [portal]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  // The public landing experience uses its own full-page gradient wash (DemoPage.tsx) —
  // the ambient brush-stroke wash behind it would just be a second, conflicting background.
  const hideAmbientBackground = pathname === '/' || pathname === '/demo';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!hideAmbientBackground && <PortalGradientBackground />}
      <ToastViewport />
      <Outlet />
    </ThemeProvider>
  );
}
