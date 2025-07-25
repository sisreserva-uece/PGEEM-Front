import type { Equipamento, EquipamentoEspacoLink, EquipamentoLinkPayload, TipoEquipamento } from '../types';
import type { EquipamentoCreatePayload, EquipamentoUpdatePayload, TipoEquipamentoCreatePayload, TipoEquipamentoUpdatePayload } from '../validation/equipamentoSchema';
import type { PaginatedResponse } from '@/types/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store/authStore';
import apiClient from '@/lib/api/apiClient';
import { fetchAllPaginated } from '@/lib/api/fetchAllPaginated';
import { createCrudHooks } from '@/lib/hooks/useCrud';
import { EquipamentoStatus } from '../types';

export const {
  useGet: useGetTiposEquipamento,
  useCreate: useCreateTipoEquipamento,
  useUpdate: useUpdateTipoEquipamento,
} = createCrudHooks<TipoEquipamento, TipoEquipamentoCreatePayload, TipoEquipamentoUpdatePayload>('equipamento/tipo');

export const {
  useGet: useGetEquipamentos,
  useCreate: useCreateEquipamento,
  useGetById: useGetEquipamentoById,
} = createCrudHooks<Equipamento, EquipamentoCreatePayload, EquipamentoUpdatePayload>('equipamento');

export function useUpdateEquipamento() {
  const queryClient = useQueryClient();
  const usuarioId = useAuthStore.getState().user?.id;
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & EquipamentoUpdatePayload) => {
      if (!usuarioId) {
        throw new Error('Usuário não autenticado para realizar a operação.');
      }
      const payload = { ...data, usuarioId };
      return apiClient.put(`/equipamento/${id}`, payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['equipamento'] });
      await queryClient.invalidateQueries({ queryKey: ['nonGenericEquipamentos'] });
      await queryClient.invalidateQueries({ queryKey: ['equipamento/tipo'] });
    },
  });
}

export function useLinkEquipamentosToEspaco() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore.getState();
  return useMutation({
    mutationFn: async (data: { espacoId: string; equipamentos: EquipamentoLinkPayload[] }) => {
      if (!user) {
        throw new Error('Usuário não autenticado.');
      }
      const payload = {
        usuarioId: user.id,
        espacoId: data.espacoId,
        equipamentos: data.equipamentos,
      };
      return apiClient.post('/equipamento/espaco', payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['equipamentoEspaco', variables.espacoId] });
      variables.equipamentos.forEach((equip) => {
        queryClient.invalidateQueries({ queryKey: ['espacoForEquipamento'] });
      });
    },
  });
}
export function useUnlinkEquipamentosFromEspaco() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore.getState();
  return useMutation({
    mutationFn: (data: { equipamentoEspacoIds: string[]; espacoId: string; equipamentoIds: string[] }) => {
      if (!user) {
        throw new Error('Usuário não autenticado.');
      }
      const payload = {
        usuarioId: user.id,
        equipamentoEspacoIds: data.equipamentoEspacoIds,
      };
      return apiClient.post('/equipamento/espaco/inativacoes', payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['equipamentoEspaco', variables.espacoId] });
      variables.equipamentoIds.forEach((id) => {
        queryClient.invalidateQueries({ queryKey: ['espacoForEquipamento', id] });
      });
    },
  });
}

const espacoForEquipamentoKeys = {
  all: ['espacoForEquipamento'] as const,
  detail: (equipamentoId: string) => [...espacoForEquipamentoKeys.all, equipamentoId] as const,
};

export function useGetEspacoForEquipamento(equipamentoId: string) {
  return useQuery({
    queryKey: espacoForEquipamentoKeys.detail(equipamentoId),
    queryFn: async () => {
      const response = await apiClient.get<{ data: PaginatedResponse<EquipamentoEspacoLink> }>('/equipamento/espaco', {
        params: { equipamentoId },
      });
      const firstLink = response.data.data.content[0];
      return firstLink ? firstLink.espaco : null;
    },
    enabled: !!equipamentoId,
  });
}

export function useGetEquipamentosByTipo(tipoId: string) {
  return useQuery({
    queryKey: ['equipamentosByTipo', tipoId],
    queryFn: async () => {
      const response = await apiClient.get<{ data: PaginatedResponse<Equipamento> }>('/equipamento', {
        params: { tipoEquipamento: tipoId, status: EquipamentoStatus.ATIVO },
      });
      return response.data.data.content;
    },
    enabled: !!tipoId,
  });
}

const allTiposEquipamentoKeys = {
  all: ['allTiposEquipamento'] as const,
  list: (params: Record<string, any>) => [...allTiposEquipamentoKeys.all, params] as const,
};

/**
 * Fetches ALL "Tipos de Equipamento" by iterating through all pages.
 * @param params - Optional parameters like `search` to filter the results.
 * @returns A useQuery result containing a single array of all matching TipoEquipamento.
 */
export function useGetAllTiposEquipamento(params: { search?: string } = {}) {
  return useQuery({
    queryKey: allTiposEquipamentoKeys.list(params),
    queryFn: () => fetchAllPaginated<TipoEquipamento>('/equipamento/tipo', params),
  });
}

/**
 * Fetches ALL "Tipos de Equipamento" that are non-generic, then fetches ALL equipment
 * associated with those types. This is a workaround for backend limitations.
 * @returns A useQuery result containing a single array of all matching non-generic Equipamento.
 */
export function useGetAllNonGenericEquipamentos() {
  const { data: allTipos, isLoading: isLoadingTipos } = useGetAllTiposEquipamento();
  const nonGenericQuery = useQuery({
    queryKey: ['nonGenericEquipamentos', allTipos?.map(t => t.id)],
    queryFn: async () => {
      if (!allTipos) {
        return [];
      }
      const nonGenericTipoIds = allTipos
        .filter(tipo => tipo.isDetalhamentoObrigatorio)
        .map(tipo => tipo.id);
      if (nonGenericTipoIds.length === 0) {
        return [];
      }
      const promises = nonGenericTipoIds.map(tipoId =>
        fetchAllPaginated<Equipamento>('/equipamento', { tipoEquipamento: tipoId }),
      );
      const results = await Promise.all(promises);
      return results.flat();
    },
    enabled: !!allTipos,
  });
  return {
    data: nonGenericQuery.data,
    isLoading: isLoadingTipos || nonGenericQuery.isLoading,
    isError: nonGenericQuery.isError,
  };
}
