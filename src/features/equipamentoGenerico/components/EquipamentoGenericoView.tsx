'use client';

import type { EquipamentoGenerico } from '../types';

import { InfoItem } from '@/features/equipamentos/components/EquipamentoView';

type EquipamentoGenericoMainDataViewProps = {
  entity: EquipamentoGenerico;
};

/**
 * Read-only summary of a catalog entry.
 * The catalog entity only carries a name, so the view surface is minimal.
 * No RelationsViewComponent is needed — we do not navigate from a catalog
 * item to its space allocations.
 */
export function EquipamentoGenericoMainDataView({
  entity: equipamento,
}: EquipamentoGenericoMainDataViewProps) {
  return (
    <div className="grid grid-cols-1 gap-y-6">
      <InfoItem label="Nome">{equipamento.nome}</InfoItem>
    </div>
  );
}
