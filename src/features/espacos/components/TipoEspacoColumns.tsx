'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { TipoEspaco } from '../types';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';

type GetTipoEspacoColumnsProps = {
  onEdit: (tipo: TipoEspaco) => void;
};

export const getTipoEspacoColumns = ({ onEdit }: GetTipoEspacoColumnsProps): ColumnDef<TipoEspaco>[] => [
  {
    accessorKey: 'nome',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nome" />,
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => (
      <Button variant="ghost" size="icon" onClick={() => onEdit(row.original)}>
        <Pencil className="h-4 w-4" />
        <span className="sr-only">Editar</span>
      </Button>
    ),
  },
];
