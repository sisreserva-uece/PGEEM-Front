import type { Cargo, Usuario } from '../types';
import type { UsuarioUpdatePayload } from '../validation/usuarioSchema';
import type { ApiSelectOption, PaginatedResponse } from '@/types/api';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/apiClient';
import { fetchAllPaginated } from '@/lib/api/fetchAllPaginated';
import { createCrudHooks } from '@/lib/hooks/useCrud';

const usuarioKeys = {
  all: ['usuarios'] as const,
  lists: () => [...usuarioKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...usuarioKeys.lists(), filters] as const,
};

export const { useGetById: useGetUserById } = createCrudHooks<Usuario>('auth/usuario');
export const { useGetById: useGetInstituicaoById } = createCrudHooks<ApiSelectOption>('instituicao');

export function useGetUsuarios(params: Record<string, any>) {
  return useQuery({
    queryKey: usuarioKeys.list(params),
    queryFn: async () => {
      const response = await apiClient.get<{ data: PaginatedResponse<Usuario> }>('/auth/usuario', { params });
      return response.data.data;
    },
    placeholderData: keepPreviousData,
  });
}

export function useGetCargos() {
  return useQuery({
    queryKey: ['cargos'],
    queryFn: () => fetchAllPaginated<Cargo>('/cargo', {}),
    staleTime: 1000 * 60 * 5,
  });
}

export function useGetInstituicoes() {
  return useQuery({
    queryKey: ['instituicoes'],
    queryFn: () => fetchAllPaginated<ApiSelectOption>('/instituicao', {}),
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & UsuarioUpdatePayload) => {
      return apiClient.put(`/auth/usuario/${id}`, data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: usuarioKeys.lists() });
    },
  });
}
