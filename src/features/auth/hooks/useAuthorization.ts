import type { UserRole } from '../types';
import { usePathname } from 'next/navigation';
import { getAllowedRolesForPath } from '@/config/protectedRoutes';
import { useAuthStore } from '@/features/auth/store/authStore';

export function useAuthorization() {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const userRoles = (user?.cargos?.map(cargo => cargo.nome) || []) as UserRole[];
  const allowedRoles = getAllowedRolesForPath(pathname);
  if (!allowedRoles) {
    return { isAuthorized: true };
  }
  if (allowedRoles.length === 0) {
    return { isAuthorized: true };
  }
  const isAuthorized = allowedRoles.some(role =>
    userRoles.includes(role),
  );
  return { isAuthorized };
}
