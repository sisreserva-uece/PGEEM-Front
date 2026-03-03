'use client';

import { ManageRelatoriosTab } from '@/features/espacos/components/ManageRelatoriosTab';
import type { Equipamento } from '../types';
import { FileText } from 'lucide-react';

export function EquipamentoRelatorioView({ entity }: { entity: Equipamento }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
        <FileText className="h-4 w-4 text-[#10B981]" />
        <h4 className="text-sm font-bold text-slate-700 uppercase tracking-tight">
          Exportar Estatísticas
        </h4>
      </div>
      <div className="bg-slate-50/50 p-4 rounded-xl border border-dashed border-slate-200">
        <ManageRelatoriosTab id={entity.id} tipo="equipamentos" />
      </div>
    </div>
  );
}