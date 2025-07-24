import type { UserRole } from '../types';
import { useAuthStore } from '../store/authStore';

const permissionsConfig = {
  espacos: {
    canView: ['ADMIN', 'COORDENADOR', 'PROFESSOR'] as const,
    canCreate: ['ADMIN', 'COORDENADOR'] as const,
    canEdit: ['ADMIN', 'COORDENADOR'] as const,
    canEditGestores: ['ADMIN'] as const,
    canEditEquipamentos: ['ADMIN', 'COORDENADOR'] as const,
  },
  equipamentos: {
    canView: ['ADMIN', 'COORDENADOR', 'PROFESSOR'] as const,
    canCreate: ['ADMIN', 'COORDENADOR', 'PROFESSOR'] as const,
    canEdit: ['ADMIN', 'COORDENADOR'] as const,
    canManageTipos: ['ADMIN'] as const,
  },
} as const;
export type PermissionsConfig = typeof permissionsConfig;
export type Feature = keyof PermissionsConfig;

export type PermissionChecks<T extends Feature> = {
  [K in keyof PermissionsConfig[T]]: boolean;
};

export function usePermissions<T extends Feature>(feature: T): PermissionChecks<T> {
  const { user } = useAuthStore();
  const userRoles = user?.cargos?.map(cargo => cargo.nome) || [];
  const hasAccess = (allowedRoles: readonly UserRole[]) => {
    if (userRoles.includes('ADMIN')) {
      return true;
    }
    if (allowedRoles.length === 0) {
      return true;
    }
    return allowedRoles.some(role => userRoles.includes(role));
  };
  const featurePermissions = permissionsConfig[feature];
  const permissionEntries = Object.entries(featurePermissions).map(
    ([key, roles]) => {
      const hasPermission = hasAccess(roles);
      return [key, hasPermission];
    },
  );
  return Object.fromEntries(permissionEntries) as PermissionChecks<T>;
}
