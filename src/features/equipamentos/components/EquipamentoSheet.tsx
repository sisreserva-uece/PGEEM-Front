'use client';

import type { Equipamento } from '../types';
import { MasterDetailSheet } from '@/components/ui/master-detail-sheet';
import { usePermissions } from '@/features/auth/hooks/usePermissions';
import { EquipamentoForm } from './EquipamentoForm';
import { EquipamentoView } from './EquipamentoView';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipamento?: Equipamento | null;
  initialMode?: 'view' | 'edit';
};

export function EquipamentoSheet({ open, onOpenChange, equipamento, initialMode }: Props) {
  const { canEdit } = usePermissions('equipamentos');

  return (
    <MasterDetailSheet
      open={open}
      onOpenChange={onOpenChange}
      entity={equipamento}
      entityName="Equipamento"
      initialMode={initialMode}
      canEdit={canEdit}
      ViewComponent={EquipamentoView}
      FormComponent={EquipamentoForm}
    />
  );
}
