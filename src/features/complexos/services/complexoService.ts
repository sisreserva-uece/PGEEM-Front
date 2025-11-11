import type { Complexo } from '../types';
import type { ComplexoCreatePayload, ComplexoUpdatePayload } from '../validation/complexoSchema';
import type { Espaco } from '@/features/espacos/types'; // Import Espaco type
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/apiClient';
import { createCrudHooks } from '@/lib/hooks/useCrud';

export const {
  useGet: useGetComplexos,
  useCreate: useCreateComplexo,
  useUpdate: useUpdateComplexo,
  useDelete: useDeleteComplexo,
  useGetById: useGetComplexoById,
} = createCrudHooks<Complexo, ComplexoCreatePayload, ComplexoUpdatePayload>('complexo-espacos');

const complexoEspacoKeys = {
  all: (complexoId: string) => ['linkedEspacos', complexoId] as const,
};

/**
 * Fetches all Espaços currently linked to a specific Complexo.
 */
export function useGetLinkedEspacos(complexoId: string) {
  return useQuery({
    queryKey: complexoEspacoKeys.all(complexoId),
    queryFn: async () => {
      const response = await apiClient.get<{ data: Espaco[] }>(`/complexo-espacos/${complexoId}/espacos`);
      return response.data.data;
    },
    enabled: !!complexoId,
  });
}

/**
 * Re-exporting this hook from espacoService is still correct.
 */
export { useGetAllEspacos } from '@/features/espacos/services/espacoService';

/**
 * Mutation to add (link) an Espaço to a Complexo.
 */
export function useAddEspacoToComplexo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ complexoId, espacoId }: { complexoId: string; espacoId: string }) => {
      const payload = { espacoIds: [espacoId] };
      return apiClient.post(`/complexo-espacos/${complexoId}/espacos`, payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: complexoEspacoKeys.all(variables.complexoId) });
    },
  });
}

/**
 * Mutation to remove (unlink) an Espaço from a Complexo.
 */
export function useRemoveEspacoFromComplexo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ complexoId, espacoId }: { complexoId: string; espacoId: string }) => {
      const payload = { espacoIds: [espacoId] };
      return apiClient.delete(`/complexo-espacos/${complexoId}/espacos`, { data: payload });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: complexoEspacoKeys.all(variables.complexoId) });
    },
  });
}
