import { create } from 'zustand';
import type { AuthUser, PortalKey } from '../types/rbac';
import { ROLE_PERMISSIONS } from '../lib/rolePermissions';
import { clearTokens } from '../lib/tokenStorage';

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  /** True until the initial session-restore check (GET /auth/me) has resolved. */
  isBootstrapping: boolean;
  themeMode: 'dark' | 'light';
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  setBootstrapped: () => void;
  toggleThemeMode: () => void;
  switchPortal: (portal: PortalKey) => void;
  setActiveChild: (childId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isBootstrapping: true,
  themeMode: 'dark',
  setUser: (user) => set({ user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  setBootstrapped: () => set({ isBootstrapping: false }),
  toggleThemeMode: () => set((s) => ({ themeMode: s.themeMode === 'dark' ? 'light' : 'dark' })),
  switchPortal: (portal) => {
    const current = get().user;
    if (!current || !current.roles.includes(portal)) return;
    set({ user: { ...current, portal, permissions: ROLE_PERMISSIONS[portal] } });
  },
  setActiveChild: (childId) => {
    const current = get().user;
    if (!current || !current.children?.some((c) => c.id === childId)) return;
    set({ user: { ...current, activeChildId: childId } });
  },
  logout: () => {
    clearTokens();
    set({ user: null });
  },
}));
