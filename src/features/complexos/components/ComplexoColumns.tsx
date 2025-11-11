'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { Complexo } from '../types';
import { Eye, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';

type GetComplexoColumnsProps = {
  onView: (complexo: Complexo) => void;
  onEdit: (complexo: Complexo) => void;
  canEdit: boolean;
};

export const getComplexoColumns = ({ onView, onEdit, canEdit }: GetComplexoColumnsProps): ColumnDef<Complexo>[] => [
  {
    accessorKey: 'nome',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nome" />,
  },
  {
    accessorKey: 'site',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Site" />,
    cell: ({ row }) => {
      const site = row.original.site;
      return site
        ? (
            <a href={site} target="_blank" rel="noopener noreferrer" className="text-primary underline-offset-4 hover:underline">
              Acessar
            </a>
          )
        : (
            <span className="text-muted-foreground italic">N/A</span>
          );
    },
  },
  {
    accessorKey: 'descricao',
    header: 'Descrição',
    cell: ({ row }) => {
      const desc = row.original.descricao;
      return <p className="truncate max-w-xs">{desc || ''}</p>;
    },
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => onView(row.original)} title="Visualizar detalhes">
          <Eye className="h-4 w-4" />
          <span className="sr-only">Visualizar</span>
        </Button>
        {canEdit && (
          <Button variant="ghost" size="icon" onClick={() => onEdit(row.original)} title="Editar complexo">
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Editar</span>
          </Button>
        )}
      </div>
    ),
  },
];
