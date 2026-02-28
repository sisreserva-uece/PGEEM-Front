import type { ReservableResource } from '@/features/reservas/types';

export function buildResourceFilter(resource: ReservableResource) {
  if (resource.type === 'espaco') {
    return { espacoId: resource.id };
  }

  return { equipamentoId: resource.id };
}
