import type { z } from 'zod';
import type { Equipamento, Espaco, EspacoGestorLink, TipoEquipamento, Usuario } from '../types';
import type { espacoFormSchema } from '../validation/espacoSchema';
import type { ApiSelectOption, PaginatedResponse } from '@/types/api';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store/authStore';
import apiClient from '@/lib/api/apiClient';
import { fetchAllPaginated } from '@/lib/api/fetchAllPaginated';
import { createCrudHooks } from '@/lib/hooks/useCrud';
import { EquipamentoStatus } from '../types';

type EspacoCreateDto = z.infer<typeof espacoFormSchema>;
type EspacoUpdateDto = z.infer<typeof espacoFormSchema>;

export const {
  useGetAll: useGetEspacos,
  useCreate: useCreateEspaco,
  useUpdate: useUpdateEspaco,
} = createCrudHooks<Espaco, EspacoCreateDto, EspacoUpdateDto>('espaco');

const espacoGestorKeys = {
  all: (espacoId: string) => ['espacoGestores', espacoId] as const,
  lists: (espacoId: string) => [...espacoGestorKeys.all(espacoId), 'list'] as const,
};

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
  return useMutation({
    mutationFn: (data: { espacoId: string; usuarioGestorId: string }) => {
      return apiClient.post('/espaco/gestor', data);
    },
    onSuccess: (_, variables) => {
      return queryClient.invalidateQueries({ queryKey: espacoGestorKeys.lists(variables.espacoId) });
    },
  });
}

export function useRemoveGestorFromEspaco() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { linkId: string; espacoId: string }) => {
      return apiClient.delete(`/espaco/gestor/${variables.linkId}`);
    },
    onSuccess: (_, variables) => {
      return queryClient.invalidateQueries({ queryKey: espacoGestorKeys.lists(variables.espacoId) });
    },
  });
}

export function useGetSelectOptions(endpoint: string, key: string) {
  return useQuery({
    queryKey: ['selectOptions', key],
    queryFn: async () => {
      const response = await apiClient.get<{ data: PaginatedResponse<ApiSelectOption> }>(endpoint, { params: { todos: true } });
      return response.data.data.content;
    },
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

export function useGetAllEquipamentos(params: { search?: string; page?: number; size?: number }) {
  return useQuery({
    queryKey: ['allEquipamentos', params],
    queryFn: async () => {
      const response = await apiClient.get<{ data: PaginatedResponse<Equipamento> }>('/equipamento', { params });
      return response.data.data;
    },
    placeholderData: keepPreviousData,
  });
}

type EquipamentoLinkPayload = {
  tombamento: string | null;
  descricao: string;
  statusEquipamento: string;
  tipoEquipamentoId: string;
};

type LinkEquipamentosPayload = {
  espacoId: string;
  usuarioId: string;
  equipamentos: EquipamentoLinkPayload[];
};

export function useLinkEquipamentos() {
  const queryClient = useQueryClient();
  const usuarioId = useAuthStore.getState().user?.id;
  return useMutation({
    mutationFn: (data: { espacoId: string; equipamentos: EquipamentoLinkPayload[] }) => {
      if (!usuarioId) {
        throw new Error('Usuário não autenticado.');
      }
      const payload: LinkEquipamentosPayload = { ...data, usuarioId };
      return apiClient.post('/equipamento/espaco', payload);
    },
    onSuccess: (_, variables) => {
      return queryClient.invalidateQueries({ queryKey: equipamentoEspacoKeys.lists(variables.espacoId) });
    },
  });
}

export function useUnlinkEquipamento() {
  const queryClient = useQueryClient();
  const usuarioId = useAuthStore.getState().user?.id;
  return useMutation({
    mutationFn: (data: { espacoId: string; equipamentoEspacoId: string }) => {
      if (!usuarioId) {
        throw new Error('Usuário não autenticado.');
      }
      return apiClient.delete('/equipamento/espaco', {
        params: {
          equipamentoEspacoId: data.equipamentoEspacoId,
          usuarioId,
        },
      });
    },
    onSuccess: (_, variables) => {
      return queryClient.invalidateQueries({ queryKey: equipamentoEspacoKeys.lists(variables.espacoId) });
    },
  });
}

export function useGetUniqueTiposDeEquipamento(params: { search?: string }) {
  return useQuery({
    queryKey: ['allEquipmentTypes', params],
    queryFn: async () => {
      const allItems = await fetchAllPaginated<Equipamento>('/equipamento', params);
      const tipoMap = new Map<string, TipoEquipamento>();
      allItems.forEach((item) => {
        if (!tipoMap.has(item.tipoEquipamento.id)) {
          tipoMap.set(item.tipoEquipamento.id, item.tipoEquipamento);
        }
      });
      return Array.from(tipoMap.values());
    },
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
