import { create } from 'zustand';
import { useEffect, useState } from 'react';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const BREAKPOINTS: Record<Breakpoint, number> = { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 };

function getBreakpoint(width: number): Breakpoint {
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'xs';
}

interface LayoutUIState {
  sidebarExpanded: boolean;
  mobileDrawerOpen: boolean;
  commandPaletteOpen: boolean;
  contextualPanelOpen: boolean;
  toggleSidebar: () => void;
  setSidebarExpanded: (expanded: boolean) => void;
  openMobileDrawer: () => void;
  closeMobileDrawer: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleContextualPanel: () => void;
}

export const useLayoutStore = create<LayoutUIState>((set) => ({
  sidebarExpanded: true,
  mobileDrawerOpen: false,
  commandPaletteOpen: false,
  contextualPanelOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarExpanded: !s.sidebarExpanded })),
  setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),
  openMobileDrawer: () => set({ mobileDrawerOpen: true }),
  closeMobileDrawer: () => set({ mobileDrawerOpen: false }),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  toggleContextualPanel: () => set((s) => ({ contextualPanelOpen: !s.contextualPanelOpen })),
}));

export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() =>
    typeof window === 'undefined' ? 'lg' : getBreakpoint(window.innerWidth),
  );

  useEffect(() => {
    function handleResize() {
      setBreakpoint(getBreakpoint(window.innerWidth));
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
}

export function useLayout() {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'xs' || breakpoint === 'sm';
  const isTablet = breakpoint === 'md';
  const isDesktop = breakpoint === 'lg' || breakpoint === 'xl';
  const layoutState = useLayoutStore();

  useEffect(() => {
    if (breakpoint === 'md') useLayoutStore.getState().setSidebarExpanded(false);
    else if (breakpoint === 'lg' || breakpoint === 'xl')
      useLayoutStore.getState().setSidebarExpanded(true);
  }, [breakpoint]);

  return { breakpoint, isMobile, isTablet, isDesktop, ...layoutState };
}
