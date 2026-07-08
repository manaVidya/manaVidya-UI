import { useCallback, useMemo } from 'react';
import { useAuthStore } from '../store/authStore';

export function usePermissions() {
  const permissions = useAuthStore((s) => s.user?.permissions ?? []);
  const permissionSet = useMemo(() => new Set(permissions), [permissions]);

  const can = useCallback(
    (key: string) => permissionSet.has(key) || permissionSet.has(`${key.split('.')[0]}.*`),
    [permissionSet],
  );

  return { can, permissions };
}
