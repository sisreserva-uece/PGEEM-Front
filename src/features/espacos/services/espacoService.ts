import type { z } from 'zod';
import type { Espaco } from '../types';
import type { espacoFormSchema } from '../validation/espacoSchema';
import type { ApiSelectOption, PaginatedResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/apiClient';
import { createCrudHooks } from '@/lib/hooks/useCrud';

type EspacoCreateDto = z.infer<typeof espacoFormSchema>;
type EspacoUpdateDto = z.infer<typeof espacoFormSchema>;

export const {
  useGetAll: useGetEspacos,
  useCreate: useCreateEspaco,
  useUpdate: useUpdateEspaco,
} = createCrudHooks<Espaco, EspacoCreateDto, EspacoUpdateDto>('espaco');

export function useGetSelectOptions(endpoint: string, key: string) {
  return useQuery({
    queryKey: ['selectOptions', key], // Simplified key
    queryFn: async () => {
      const response = await apiClient.get<{ data: PaginatedResponse<ApiSelectOption> }>(endpoint, { params: { todos: true } });
      return response.data.data.content;
    },
    staleTime: 1000 * 60 * 5,
  });
}
