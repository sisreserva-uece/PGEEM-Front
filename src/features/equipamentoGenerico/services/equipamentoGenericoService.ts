import type { EquipamentoGenerico, EquipamentoGenericoEspaco } from '../types';
import type {
  AtualizarQuantidadePayload,
  EquipamentoGenericoEspacoCreatePayload,
} from '../validation/equipamentoGenericoEspacoSchema';
import type {
  EquipamentoGenericoCreatePayload,
  EquipamentoGenericoUpdatePayload,
} from '../validation/equipamentoGenericoSchema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/apiClient';
import { fetchAllPaginated } from '@/lib/api/fetchAllPaginated';
import { createCrudHooks } from '@/lib/hooks/useCrud';

export const {
  useGet: useGetEquipamentosGenericos,
  useGetById: useGetEquipamentoGenericoById,
  useCreate: useCreateEquipamentoGenerico,
  useUpdate: useUpdateEquipamentoGenerico,
  useDelete: useDeleteEquipamentoGenerico,
} = createCrudHooks<
  EquipamentoGenerico,
  EquipamentoGenericoCreatePayload,
  EquipamentoGenericoUpdatePayload
> ('equipamento-generico');

const equipamentoGenericoKeys = {
  all: ['equipamentoGenerico'] as const,
  allList: () => [...equipamentoGenericoKeys.all, 'all'] as const,
};

export function useGetAllEquipamentosGenericos() {
  return useQuery({
    queryKey: equipamentoGenericoKeys.allList(),
    queryFn: () =>
      fetchAllPaginated<EquipamentoGenerico>('/equipamento-generico', {}),
  });
}

const equipamentoGenericoEspacoKeys = {
  all: ['equipamentoGenericoEspaco'] as const,
  byEspaco: (espacoId: string) =>
    [...equipamentoGenericoEspacoKeys.all, espacoId] as const,
};

export function useGetEquipamentosGenericosEspaco(espacoId: string | null) {
  return useQuery({
    queryKey: equipamentoGenericoEspacoKeys.byEspaco(espacoId!),
    queryFn: async () => {
      const response = await apiClient.get<{
        data: EquipamentoGenericoEspaco[];
      }>(`/equipamento-generico-espaco/espaco/${espacoId}`);
      return response.data.data;
    },
    enabled: !!espacoId,
  });
}

export function useVincularEquipamentoGenerico() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: EquipamentoGenericoEspacoCreatePayload) =>
      apiClient.post('/equipamento-generico-espaco', payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: equipamentoGenericoEspacoKeys.byEspaco(variables.espacoId),
      });
    },
  });
}

export function useDesvincularEquipamentoGenerico() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ vinculoId }: { vinculoId: string; espacoId: string }) =>
      apiClient.delete(`/equipamento-generico-espaco/${vinculoId}`),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: equipamentoGenericoEspacoKeys.byEspaco(variables.espacoId),
      });
    },
  });
}

export function useAtualizarQuantidade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      vinculoId,
      ...payload
    }: { vinculoId: string; espacoId: string } & AtualizarQuantidadePayload) =>
      apiClient.put(
        `/equipamento-generico-espaco/${vinculoId}/quantidade`,
        payload,
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: equipamentoGenericoEspacoKeys.byEspaco(variables.espacoId),
      });
    },
  });
}
