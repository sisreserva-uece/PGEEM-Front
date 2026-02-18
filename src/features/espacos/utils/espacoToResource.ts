import type { Espaco } from '../types';
import type { ReservableResource } from '@/features/reservas/types';

export function espacoToResource(espaco: Espaco): ReservableResource {
  return {
    id: espaco.id,
    type: 'espaco',
    displayName: espaco.nome,
    requiresProject: espaco.precisaProjeto,
  };
}
