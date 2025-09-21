import type { Reserva } from '../types';
import type { ReservaCreatePayload } from '../validation/reservaSchema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/store/authStore';
import apiClient from '@/lib/api/apiClient';
import { createCrudHooks } from '@/lib/hooks/useCrud';
import { ReservaStatus } from '../types';

const { useGet, useCreate: useCreateReserva } = createCrudHooks<
    Reserva,
    ReservaCreatePayload
>('solicitacao-reserva');

export function useGetMyReservations(params: Record<string, any>) {
  const { user } = useAuthStore();
  const allParams = { ...params, usuarioSolicitanteId: user?.id };
  return useGet(allParams);
}

export function useGetSolicitacoesByEspaco(params: Record<string, any>) {
  return useGet({
    ...params,
    _enabled: !!params.espacoId,
  });
}

export function useUpdateSolicitacaoStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ReservaStatus }) => {
      const response = await apiClient.patch(`/solicitacao-reserva/${id}/status`, { status });
      return response.data;
    },
    onSuccess: (_, { status }) => {
      // Invalidate all queries related to solicitations to refetch data
      queryClient.invalidateQueries({ queryKey: ['solicitacoes'] });
      const action = status === ReservaStatus.APROVADO ? 'aprovada' : 'recusada';
      toast.success(`Solicitação ${action} com sucesso!`);
    },
    onError: (error) => {
      toast.error(`Erro ao processar solicitação: ${error.message}`);
    },
  });
}

export { useCreateReserva };
