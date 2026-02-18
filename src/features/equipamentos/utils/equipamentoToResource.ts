import type { Equipamento } from '../types';
import type { ReservableResource } from '@/features/reservas/types';

export function equipamentoToResource(equipamento: Equipamento): ReservableResource {
  return {
    id: equipamento.id,
    type: 'equipamento',
    displayName: `${equipamento.tipoEquipamento.nome} - ${equipamento.tombamento}`,
    requiresProject: false,
  };
}
