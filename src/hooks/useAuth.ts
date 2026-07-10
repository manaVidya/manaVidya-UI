import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isBootstrapping = useAuthStore((s) => s.isBootstrapping);
  const themeMode = useAuthStore((s) => s.themeMode);
  const toggleThemeMode = useAuthStore((s) => s.toggleThemeMode);
  const switchPortal = useAuthStore((s) => s.switchPortal);
  const setActiveChild = useAuthStore((s) => s.setActiveChild);
  const logout = useAuthStore((s) => s.logout);
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);
  const setBootstrapped = useAuthStore((s) => s.setBootstrapped);

  return {
    user,
    isLoading,
    isBootstrapping,
    themeMode,
    toggleThemeMode,
    switchPortal,
    setActiveChild,
    logout,
    setUser,
    setLoading,
    setBootstrapped,
    availablePortals: user?.roles ?? [],
    activeChild: user?.children?.find((c) => c.id === user.activeChildId) ?? user?.children?.[0],
  };
}
