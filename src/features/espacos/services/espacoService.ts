import type { z } from 'zod';
import type { ApiSelectOption, Espaco, PaginatedResponse } from '../types';
import type { espacoFormSchema } from '../validation/espacoSchema';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/apiClient';

export const espacoKeys = {
  all: ['espacos'] as const,
  lists: () => [...espacoKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...espacoKeys.lists(), filters] as const,
  details: () => [...espacoKeys.all, 'detail'] as const,
  detail: (id: string) => [...espacoKeys.details(), id] as const,
  selectOptions: (name: string) => [...espacoKeys.all, 'selectOptions', name] as const,
};

export function useGetEspacos(params: {
  page: number;
  size: number;
  sortField: string;
  sortOrder: 'asc' | 'desc';
}) {
  return useQuery({
    queryKey: espacoKeys.list(params),
    queryFn: async () => {
      const response = await apiClient.get<{ data: PaginatedResponse<Espaco> }>('/espaco', { params });
      return response.data.data;
    },
    placeholderData: keepPreviousData,
  });
}

export function useGetSelectOptions(endpoint: string, key: string) {
  return useQuery({
    queryKey: espacoKeys.selectOptions(key),
    queryFn: async () => {
      const response = await apiClient.get<{ data: PaginatedResponse<ApiSelectOption> }>(endpoint);
      return response.data.data.content;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateEspaco() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newEspaco: z.infer<typeof espacoFormSchema>) => {
      return apiClient.post('/espaco', newEspaco);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: espacoKeys.lists() });
    },
  });
}

export function useUpdateEspaco() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...updatedEspaco }: { id: string } & z.infer<typeof espacoFormSchema>) => {
      return apiClient.put(`/espaco/${id}`, updatedEspaco);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: espacoKeys.lists() });
    },
  });
}

export function useDeleteEspaco() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      return apiClient.delete(`/espaco/${id}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: espacoKeys.lists() });
    },
  });
}
