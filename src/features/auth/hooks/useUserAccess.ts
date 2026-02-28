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
  const isGestorOfAnyEspaco = managedEspacoIds.length > 0;
  const isGestorOfCurrentEspaco = !!espaco && managedEspacoIds.includes(espaco.id);

  return useMemo(() => {
    const hasGlobalRole = (roles: UserRole[]) => {
      if (userRoles.includes('ADMIN')) {
        return true;
      }
      return roles.some(role => userRoles.includes(role));
    };

    return {
      isAdmin: hasGlobalRole(['ADMIN']),
      isLoading: isLoadingManagedEspacos,
      isGestor: isGestorOfAnyEspaco,
      canCreateEspaco: hasGlobalRole(['ADMIN']),
      canEditEspacoDetails: hasGlobalRole(['ADMIN']) || isGestorOfCurrentEspaco,
      canManageRelatorioEquipamentos: hasGlobalRole(['ADMIN']) || isGestorOfCurrentEspaco,
      canManageEspacoGestores: hasGlobalRole(['ADMIN']),
      canManageEspacoEquipamentos: hasGlobalRole(['ADMIN']) || isGestorOfCurrentEspaco,
      canCreateEquipamento: hasGlobalRole(['ADMIN']) || isGestorOfAnyEspaco,
      canViewEquipamento: true,
      canEditEquipamento: hasGlobalRole(['ADMIN']) || isGestorOfCurrentEspaco,
      canManageTiposEquipamento: hasGlobalRole(['ADMIN']),
      canManageTiposEspaco: hasGlobalRole(['ADMIN']),
      canManageProjetos: hasGlobalRole(['ADMIN']) || isGestorOfAnyEspaco,
      canManageComites: hasGlobalRole(['ADMIN']),
      canManageComplexos: hasGlobalRole(['ADMIN']),
      canManageUsuarios: hasGlobalRole(['ADMIN']),
      canMakeReservation: true,
    };
  }, [isLoadingManagedEspacos, isGestorOfAnyEspaco, isGestorOfCurrentEspaco, userRoles]);
};
