import type { ReservableResource } from '../types/reservableResource';

export function buildResourceFilter(resource: ReservableResource) {
  if (resource.type === 'espaco') {
    return { espacoId: resource.id };
  }

  return { equipamentoId: resource.id };
}
