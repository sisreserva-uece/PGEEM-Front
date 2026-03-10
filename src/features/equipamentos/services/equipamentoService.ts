import type { Equipamento, EquipamentoEspacoLink, EquipamentoLinkPayload, TipoEquipamento } from '../types';
import type { EquipamentoCreatePayload, EquipamentoUpdatePayload, TipoEquipamentoCreatePayload, TipoEquipamentoUpdatePayload } from '../validation/equipamentoSchema';
import type { PaginatedResponse } from '@/types/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store/authStore';
import apiClient from '@/lib/api/apiClient';
import { fetchAllPaginated } from '@/lib/api/fetchAllPaginated';
import { createCrudHooks } from '@/lib/hooks/useCrud';

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
      return apiClient.put(`/equipamento/${id}`, { ...data, usuarioId });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['equipamento'] });
      await queryClient.invalidateQueries({ queryKey: ['allEquipamentos'] });
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
      return apiClient.post('/equipamento/espaco', {
        usuarioId: user.id,
        espacoId: data.espacoId,
        equipamentos: data.equipamentos,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['equipamentoEspaco', variables.espacoId] });
      variables.equipamentos.forEach(() => {
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
      return apiClient.post('/equipamento/espaco/inativacoes', {
        usuarioId: user.id,
        equipamentoEspacoIds: data.equipamentoEspacoIds,
      });
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

const allTiposEquipamentoKeys = {
  all: ['allTiposEquipamento'] as const,
  list: (params: Record<string, any>) => [...allTiposEquipamentoKeys.all, params] as const,
};

export function useGetAllTiposEquipamento(params: { search?: string } = {}) {
  return useQuery({
    queryKey: allTiposEquipamentoKeys.list(params),
    queryFn: () => fetchAllPaginated<TipoEquipamento>('/equipamento/tipo', params),
  });
}

export function useGetAllEquipamentos() {
  return useQuery({
    queryKey: ['allEquipamentos'],
    queryFn: () => fetchAllPaginated<Equipamento>('/equipamento', {}),
  });
}
