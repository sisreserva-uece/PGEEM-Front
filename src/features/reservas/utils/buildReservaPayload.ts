import type { ReservaCreatePayload } from '../validation/reservaSchema';
import type { ReservableResource } from '@/features/reservas/types';

type BasePayloadInput = Omit<ReservaCreatePayload, 'espacoId' | 'equipamentoId'>;

export function buildReservaPayload(
  resource: ReservableResource,
  base: BasePayloadInput,
): ReservaCreatePayload {
  if (resource.type === 'espaco') {
    return {
      ...base,
      espacoId: resource.id,
    };
  }

  return {
    ...base,
    equipamentoId: resource.id,
  };
}
