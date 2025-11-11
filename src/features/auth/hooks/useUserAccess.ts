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
  return useMemo(() => ({
    isAdmin: hasGlobalRole(['ADMIN']),
    isLoading: isLoadingManagedEspacos,
    isGestor: isGestorOfAnyEspaco,
    canCreateEspaco: hasGlobalRole(['ADMIN', 'COORDENADOR']),
    canEditEspacoDetails: hasGlobalRole(['ADMIN', 'COORDENADOR']) || isGestorOfCurrentEspaco,
    canManageEspacoGestores: hasGlobalRole(['ADMIN']),
    canManageEspacoEquipamentos: hasGlobalRole(['ADMIN', 'COORDENADOR']) || isGestorOfCurrentEspaco,
    canCreateEquipamento: hasGlobalRole(['ADMIN', 'COORDENADOR', 'PROFESSOR']) || isGestorOfAnyEspaco,
    canViewEquipamento: hasGlobalRole(['ADMIN', 'COORDENADOR', 'PROFESSOR']),
    canEditEquipamento: hasGlobalRole(['ADMIN', 'COORDENADOR']),
    canManageTiposEquipamento: hasGlobalRole(['ADMIN']),
    canManageTiposEspaco: hasGlobalRole(['ADMIN']),
    canManageProjetos: hasGlobalRole(['PROFESSOR', 'PESQUISADOR']),
    canManageComites: hasGlobalRole(['ADMIN', 'COORDENADOR']),
    canManageUsuarios: hasGlobalRole(['ADMIN']),
    canMakeReservation: hasGlobalRole(['ADMIN', 'PROFESSOR', 'PESQUISADOR']),
  }), [isLoadingManagedEspacos, isGestorOfAnyEspaco, isGestorOfCurrentEspaco, userRoles]);
};
