import type { UserRole } from '../types';
import type { Espaco } from '@/features/espacos/types';
import { useMemo } from 'react';
import { useGetManagedEspacosForCurrentUser } from '@/features/espacos/services/espacoService';
import { useAuthStore } from '../store/authStore';

export const useUserAccess = (espaco?: Espaco | null) => {
  const { user } = useAuthStore();
  const { data: managedEspacos, isLoading: isLoadingManagedEspacos } = useGetManagedEspacosForCurrentUser();

  const userRoles = useMemo(() => user?.cargos?.map(c => c.nome) || [], [user]);
  const managedEspacoIds = useMemo(() => managedEspacos?.map(link => link.espaco.id) || [], [managedEspacos]);

  const hasGlobalRole = (roles: UserRole[]) => {
    if (userRoles.includes('ADMIN')) {
      return true;
    }
    return roles.some(role => userRoles.includes(role));
  };

  const isGestorOfAnyEspaco = managedEspacoIds.length > 0;
  const isGestorOfCurrentEspaco = !!espaco && managedEspacoIds.includes(espaco.id);

  const access = useMemo(() => ({
    isAdmin: hasGlobalRole(['ADMIN']),
    isLoading: isLoadingManagedEspacos,
    isGestor: isGestorOfAnyEspaco,

    // Espaços Permissions
    canCreateEspaco: hasGlobalRole(['ADMIN', 'COORDENADOR']),
    canEditEspacoDetails: hasGlobalRole(['ADMIN', 'COORDENADOR']) || isGestorOfCurrentEspaco,
    canManageEspacoGestores: hasGlobalRole(['ADMIN']),
    canManageEspacoEquipamentos: hasGlobalRole(['ADMIN', 'COORDENADOR']) || isGestorOfCurrentEspaco,

    // Equipamentos Permissions
    canCreateEquipamento: hasGlobalRole(['ADMIN', 'COORDENADOR', 'PROFESSOR']) || isGestorOfAnyEspaco,
    canViewEquipamento: hasGlobalRole(['ADMIN', 'COORDENADOR', 'PROFESSOR']),
    canEditEquipamento: hasGlobalRole(['ADMIN', 'COORDENADOR']),
    canManageTiposEquipamento: hasGlobalRole(['ADMIN']),

    // Projetos Permissions
    canManageProjetos: hasGlobalRole(['PROFESSOR', 'PESQUISADOR']),

    // Comites
    canManageComites: hasGlobalRole(['ADMIN', 'COORDENADOR']),

    // Usuarios
    canManageUsuarios: hasGlobalRole(['ADMIN']),
  }), [isLoadingManagedEspacos, isGestorOfAnyEspaco, isGestorOfCurrentEspaco, userRoles]);

  return access;
};
