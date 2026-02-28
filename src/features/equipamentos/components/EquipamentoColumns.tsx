'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { Equipamento } from '../types';
import { Eye, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BooleanBadge } from '@/components/ui/boolean-badge';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { EquipamentoStatus } from '../types';

const statusMap: Record<EquipamentoStatus, { label: string; className: string }> = {
  [EquipamentoStatus.ATIVO]: { label: 'Ativo', className: 'bg-green-500 hover:bg-green-600' },
  [EquipamentoStatus.INATIVO]: { label: 'Inativo', className: 'bg-red-500 hover:bg-red-600' },
  [EquipamentoStatus.EM_MANUTENCAO]: { label: 'Em Manutenção', className: 'bg-yellow-500 hover:bg-yellow-600' },
};

type GetEquipamentoColumnsProps = {
  onView: (equipamento: Equipamento) => void;
  onEdit: (equipamento: Equipamento) => void;
  canView: boolean;
  canEdit: boolean;
};

export const getEquipamentoColumns = ({ onEdit, onView, canView, canEdit }: GetEquipamentoColumnsProps): ColumnDef<Equipamento>[] => [
  {
    accessorKey: 'tombamento',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tombamento" />,
  },
  {
    accessorKey: 'tipoEquipamento.nome',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tipo" />,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.original.status;
      const statusInfo = statusMap[status] || { label: 'Desconhecido', className: 'bg-gray-400' };
      return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>;
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'reservavel',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Reservável" />,
    cell: ({ row }) => <BooleanBadge value={row.original.reservavel} />,
  },
  {
    accessorKey: 'descricao',
    header: 'Descrição',
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        {canView && (
          <Button variant="ghost" size="icon" onClick={() => onView(row.original)}>
            <Eye className="h-4 w-4" />
            <span className="sr-only">Visualizar</span>
          </Button>
        )}
        {canEdit && (
          <Button variant="ghost" size="icon" onClick={() => onEdit(row.original)}>
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Editar</span>
          </Button>
        )}
      </div>
    ),
  },
];
