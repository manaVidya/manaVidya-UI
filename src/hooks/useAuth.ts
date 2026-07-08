import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const themeMode = useAuthStore((s) => s.themeMode);
  const toggleThemeMode = useAuthStore((s) => s.toggleThemeMode);
  const switchPortal = useAuthStore((s) => s.switchPortal);
  const setActiveChild = useAuthStore((s) => s.setActiveChild);
  const logout = useAuthStore((s) => s.logout);
  const setUser = useAuthStore((s) => s.setUser);

  return {
    user,
    isLoading,
    themeMode,
    toggleThemeMode,
    switchPortal,
    setActiveChild,
    logout,
    setUser,
    availablePortals: user?.roles ?? [],
    activeChild: user?.children?.find((c) => c.id === user.activeChildId) ?? user?.children?.[0],
  };
}
