// features/equipamentoGenerico/components/EquipamentoGenericoColumns.tsx

'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { EquipamentoGenerico } from '../types';
import { Eye, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';

type GetEquipamentoGenericoColumnsProps = {
  onView: (equipamento: EquipamentoGenerico) => void;
  onEdit: (equipamento: EquipamentoGenerico) => void;
  canView: boolean;
  canEdit: boolean;
};

export const getEquipamentoGenericoColumns = ({
  onView,
  onEdit,
  canView,
  canEdit,
}: GetEquipamentoGenericoColumnsProps): ColumnDef<EquipamentoGenerico>[] => [
  {
    accessorKey: 'nome',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        {canView && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onView(row.original)}
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">Visualizar</span>
          </Button>
        )}
        {canEdit && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(row.original)}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Editar</span>
          </Button>
        )}
      </div>
    ),
  },
];
