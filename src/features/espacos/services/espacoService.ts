import type { z } from 'zod';
import type { Espaco, EspacoGestorLink, Usuario } from '../types';
import type { espacoFormSchema } from '../validation/espacoSchema';
import type { ApiSelectOption, PaginatedResponse } from '@/types/api';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/apiClient';
import { createCrudHooks } from '@/lib/hooks/useCrud';

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
