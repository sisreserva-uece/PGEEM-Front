import type { Reserva } from '../types';
import type { ReservaCreatePayload } from '../validation/reservaSchema';
import { useAuthStore } from '@/features/auth/store/authStore';
import { createCrudHooks } from '@/lib/hooks/useCrud';

const { useGet: useGetMyReservas, useCreate: useCreateReserva } = createCrudHooks<
    Reserva,
    ReservaCreatePayload
>('solicitacao-reserva');

export function useGetMyReservations(params: Record<string, any>) {
  const { user } = useAuthStore();
  const allParams = { ...params, usuarioSolicitanteId: user?.id };
  return useGetMyReservas(allParams);
}

export { useCreateReserva };
