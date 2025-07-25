'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { Usuario } from '../types';
import { Eye, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';

type GetColumnsProps = {
  onView: (usuario: Usuario) => void;
  onEdit: (usuario: Usuario) => void;
};

export const getUsuarioColumns = ({ onView, onEdit }: GetColumnsProps): ColumnDef<Usuario>[] => [
  {
    accessorKey: 'nome',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nome" />,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
  },
  {
    accessorKey: 'matricula',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Matrícula" />,
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => onView(row.original)}><Eye className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => onEdit(row.original)}><Pencil className="h-4 w-4" /></Button>
      </div>
    ),
  },
];
