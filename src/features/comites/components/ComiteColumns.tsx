'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { Comite } from '../types';
import { Eye, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ComiteTipoMap } from '../types';

type GetColumnsProps = {
  onView: (comite: Comite) => void;
  onEdit: (comite: Comite) => void;
};

export const getComiteColumns = ({ onView, onEdit }: GetColumnsProps): ColumnDef<Comite>[] => [
  {
    accessorKey: 'descricao',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Descrição" />,
  },
  {
    accessorKey: 'tipo',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tipo" />,
    cell: ({ row }) => {
      const tipo = row.original.tipo;
      return <Badge variant="secondary">{ComiteTipoMap[tipo] ?? 'Desconhecido'}</Badge>;
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => onView(row.original)}>
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onEdit(row.original)}>
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
