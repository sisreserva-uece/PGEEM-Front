import type { PaginatedResponse } from '@/types/api';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/apiClient';

export function createCrudHooks<TData, TCreateDto = any, TUpdateDto = any>(entityName: string) {
  const queryKeys = {
    all: [entityName] as const,
    lists: () => [...queryKeys.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.lists(), filters] as const,
    details: () => [...queryKeys.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.details(), id] as const,
  };

  const useGet = (params: Record<string, any>) => {
    return useQuery({
      queryKey: queryKeys.list(params),
      queryFn: async () => {
        const response = await apiClient.get<{ data: PaginatedResponse<TData> }>(`/${entityName}`, { params });
        return response.data.data;
      },
      placeholderData: keepPreviousData,
    });
  };

  const useCreate = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (newEntity: TCreateDto) => {
        return apiClient.post(`/${entityName}`, newEntity);
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      },
    });
  };

  const useUpdate = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, ...updatedEntity }: { id: string } & TUpdateDto) => {
        return apiClient.put(`/${entityName}/${id}`, updatedEntity);
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      },
    });
  };

  const useDelete = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => {
        return apiClient.delete(`/${entityName}/${id}`);
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      },
    });
  };

  const useGetById = (id: string | null) => {
    return useQuery({
      queryKey: queryKeys.detail(id!),
      queryFn: async () => {
        const response = await apiClient.get<{ data: PaginatedResponse<TData> }>(`/${entityName}`, {
          params: { id },
        });
        const entity = response.data.data.content[0];
        if (!entity) {
          const readableName = entityName.charAt(0).toUpperCase() + entityName.slice(1);
          throw new Error(`${readableName} não encontrado.`);
        }
        return entity;
      },
      enabled: !!id,
      retry: (failureCount, error: any) => {
        if (error.message.includes('não encontrado')) {
          return false;
        }
        return failureCount < 2;
      },
    });
  };

  return { queryKeys, useGet, useCreate, useUpdate, useDelete, useGetById };
}
