import type { Espaco, EspacoGestorLink } from '../types';
import type { EspacoCreatePayload, EspacoUpdatePayload } from '../validation/espacoSchema';
import type { Usuario } from '@/features/usuarios/types';
import type { ApiSelectOption, PaginatedResponse } from '@/types/api';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store/authStore';
import apiClient from '@/lib/api/apiClient';
import { fetchAllPaginated } from '@/lib/api/fetchAllPaginated';
import { createCrudHooks } from '@/lib/hooks/useCrud';

export const {
  useGet: useGetEspacos,
  useCreate: useCreateEspaco,
  useUpdate: useUpdateEspaco,
  useGetById: useGetEspacoById,
} = createCrudHooks<Espaco, EspacoCreatePayload, EspacoUpdatePayload>('espaco');

const espacoGestorKeys = {
  all: (espacoId: string) => ['espacoGestores', espacoId] as const,
  lists: (espacoId: string) => [...espacoGestorKeys.all(espacoId), 'list'] as const,
};

/**
 * NEW: Fetches all EspacoGestorLink objects for the currently authenticated user.
 * This is used to determine which spaces the user manages.
 */
export function useGetManagedEspacosForCurrentUser() {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: ['managedEspacosForUser', user?.id],
    queryFn: () => {
      if (!user?.id) {
        return [];
      }
      return fetchAllPaginated<EspacoGestorLink>('/espaco/gestor', { gestor: user.id, estaAtivo: true });
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}

export function useGetEspacoGestores(espacoId: string) {
  return useQuery({
    queryKey: espacoGestorKeys.lists(espacoId),
    queryFn: async () => {
      const response = await apiClient.get<{ data: PaginatedResponse<EspacoGestorLink> }>('/espaco/gestor', {
        params: { todos: true, espaco: espacoId },
      });
      return response.data.data.content;
    },
    enabled: !!espacoId,
  });
}

export function useGetUsuarios(params: { nome?: string; page?: number; size?: number }) {
  return useQuery({
    queryKey: ['usuarios', { ...params }],
    queryFn: async () => {
      const response = await apiClient.get<{ data: PaginatedResponse<Usuario> }>('/auth/usuario', {
        params: { ...params, sortField: 'nome', sortOrder: 'asc' },
      });
      return response.data.data;
    },
    placeholderData: keepPreviousData,
  });
}

export function useAddGestorToEspaco() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore.getState();

  return useMutation({
    mutationFn: (data: { espacoId: string; usuarioGestorId: string }) => {
      return apiClient.post('/espaco/gestor', data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: espacoGestorKeys.lists(variables.espacoId) });
      if (variables.usuarioGestorId === user?.id) {
        queryClient.invalidateQueries({ queryKey: ['managedEspacosForUser', user?.id] });
      }
    },
  });
}

export function useRemoveGestorFromEspaco() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore.getState();

  return useMutation({
    mutationFn: (variables: { linkId: string; espacoId: string; gestorId: string }) => {
      return apiClient.delete(`/espaco/gestor/${variables.linkId}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: espacoGestorKeys.lists(variables.espacoId) });
      if (variables.gestorId === user?.id) {
        queryClient.invalidateQueries({ queryKey: ['managedEspacosForUser', user?.id] });
      }
    },
  });
}

export function useGetSelectOptions(endpoint: string, key: string) {
  return useQuery({
    queryKey: ['selectOptions', key],
    queryFn: () => fetchAllPaginated<ApiSelectOption>(endpoint, {}),
    staleTime: 1000 * 60 * 5,
  });
}

const equipamentoEspacoKeys = {
  all: (espacoId: string) => ['equipamentoEspaco', espacoId] as const,
  lists: (espacoId: string) => [...equipamentoEspacoKeys.all(espacoId), 'list'] as const,
};

export function useGetLinkedEquipamentos(espacoId: string) {
  return useQuery({
    queryKey: equipamentoEspacoKeys.lists(espacoId),
    queryFn: () => fetchAllPaginated('/equipamento/espaco', { espacoId }),
    enabled: !!espacoId,
  });
}

export function useGetAllEspacos() {
  return useQuery({
    queryKey: ['allEspacos'],
    queryFn: () => fetchAllPaginated<Espaco>('espaco', {}),
    staleTime: 1000 * 60 * 5, // Cache for 5 mins
  });
}
