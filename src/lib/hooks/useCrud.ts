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

  const useGetAll = (params: Record<string, any>) => {
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

  return { queryKeys, useGetAll, useCreate, useUpdate, useDelete };
}
