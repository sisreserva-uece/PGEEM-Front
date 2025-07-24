import type { Equipamento, EquipamentoEspacoLink, TipoEquipamento } from '../types';
import type { EquipamentoFormValues, TipoEquipamentoFormValues } from '../validation/equipamentoSchema';
import type { PaginatedResponse } from '@/types/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store/authStore';
import apiClient from '@/lib/api/apiClient';
import { createCrudHooks } from '@/lib/hooks/useCrud';

export const {
  useGetAll: useGetTiposEquipamento,
  useCreate: useCreateTipoEquipamento,
  useUpdate: useUpdateTipoEquipamento,
} = createCrudHooks<TipoEquipamento, TipoEquipamentoFormValues, { nome: string }>('equipamento/tipo');

export const {
  useGetAll: useGetEquipamentos,
  useCreate: useCreateEquipamento,
} = createCrudHooks<Equipamento, EquipamentoFormValues>('equipamento');

export function useUpdateEquipamento() {
  const queryClient = useQueryClient();
  const usuarioId = useAuthStore.getState().user?.id;
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & EquipamentoFormValues) => {
      if (!usuarioId) {
        throw new Error('Usuário não autenticado para realizar a operação.');
      }
      const payload = { ...data, usuarioId };
      return apiClient.put(`/equipamento/${id}`, payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['equipamento'] });
      await queryClient.invalidateQueries({ queryKey: ['equipamento/tipo'] });
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
