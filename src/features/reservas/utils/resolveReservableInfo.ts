import type { Reserva, ReservableResourceType } from '../types';

export function resolveReservableInfo(reserva: Reserva): {
  type: ReservableResourceType;
  id: string;
} | null {
  if ((reserva as any).espacoId) {
    return { type: 'espaco', id: (reserva as any).espacoId };
  }

  if ((reserva as any).equipamentoId) {
    return { type: 'equipamento', id: (reserva as any).equipamentoId };
  }

  return null;
}
