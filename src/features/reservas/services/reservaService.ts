import type { Reserva, ReservableResource } from '../types';
import type { ReservaCreatePayload } from '../validation/reservaSchema';
import type { PaginatedResponse } from '@/types/api';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { buildResourceFilter } from '@/features/reservas/utils/buildResourceFilter';
import apiClient from '@/lib/api/apiClient';
import { fetchAllPaginated } from '@/lib/api/fetchAllPaginated';
import { createCrudHooks } from '@/lib/hooks/useCrud';
import { ReservaStatus } from '../types';

const { useCreate: useGenericCreateReserva, useGet: useGetReservas } = createCrudHooks<
  Reserva,
  ReservaCreatePayload
>('solicitacao-reserva');

export function useCreateReserva() {
  const queryClient = useQueryClient();
  return useGenericCreateReserva({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitacoes'] });
      queryClient.invalidateQueries({ queryKey: ['reservas'] });
    },
  });
}

export function useGetMyReservations(params: {
  page: number;
  size: number;
  sortField: string;
  sortOrder: 'asc' | 'desc';
}) {
  return useGetReservas(params);
}

export function useGetSolicitacoesByEspaco(params: Record<string, any>) {
  return useQuery({
    queryKey: ['solicitacoes', params],
    queryFn: async () => {
      const response = await apiClient.get<{ data: PaginatedResponse<Reserva> }>('/solicitacao-reserva', { params });
      return response.data.data;
    },
    placeholderData: keepPreviousData,
    enabled: !!params.espacoId,
  });
}

export function useGetSolicitacoesByEspacoEquipamentos(params: Record<string, any>) {
  return useQuery({
    queryKey: ['solicitacoes', params],
    queryFn: async () => {
      const response = await apiClient.get<{ data: PaginatedResponse<Reserva> }>('/solicitacao-reserva', { params });
      return response.data.data;
    },
    placeholderData: keepPreviousData,
    enabled: !!params.espacoDoEquipamentoId,
  });
}

export function useGetAgendaReservas(resource: ReservableResource | null) {
  return useQuery({
    queryKey: ['reservas', 'agenda', resource?.type, resource?.id],
    queryFn: async () => {
      if (!resource) {
        return [];
      }

      const filter = buildResourceFilter(resource);

      const approved = fetchAllPaginated<Reserva>('solicitacao-reserva', {
        ...filter,
        statusCodigo: ReservaStatus.APROVADO,
      });

      const pending = fetchAllPaginated<Reserva>('solicitacao-reserva', {
        ...filter,
        statusCodigo: ReservaStatus.PENDENTE,
      });

      const adjustment = fetchAllPaginated<Reserva>('solicitacao-reserva', {
        ...filter,
        statusCodigo: ReservaStatus.PENDENTE_AJUSTE,
      });

      const [approvedRes, pendingRes, adjustmentRes] = await Promise.all([
        approved,
        pending,
        adjustment,
      ]);

      return [...approvedRes, ...pendingRes, ...adjustmentRes];
    },
    enabled: !!resource,
  });
}

export function useUpdateSolicitacaoStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ReservaStatus }) => {
      const response = await apiClient.put(`/solicitacao-reserva/${id}/status`, { status });
      return response.data;
    },
    onSuccess: (_, { status }) => {
      const action = status === ReservaStatus.APROVADO ? 'aprovada' : 'recusada';
      toast.success(`Solicitação ${action} com sucesso!`);

      queryClient.invalidateQueries({ queryKey: ['solicitacoes'] });
      queryClient.invalidateQueries({ queryKey: ['reservas'] });
    },
    onError: (err) => {
      toast.error(`Erro ao processar solicitação: ${err.message}`);
    },
  });
}
