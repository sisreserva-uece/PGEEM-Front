'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { Projeto } from '../types';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';

type GetColumnsProps = {
  onView: (projeto: Projeto) => void;
};

export const getProjetoColumns = ({ onView }: GetColumnsProps): ColumnDef<Projeto>[] => [
  {
    accessorKey: 'nome',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nome" />,
    cell: ({ row }) => <div className="max-w-xs truncate">{row.original.nome}</div>,
  },
  {
    accessorKey: 'dataInicio',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Início" />,
    cell: ({ row }) => new Date(row.original.dataInicio).toLocaleDateString(),
  },
  {
    accessorKey: 'dataFim',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Fim" />,
    cell: ({ row }) => new Date(row.original.dataFim).toLocaleDateString(),
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => onView(row.original)}>
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
