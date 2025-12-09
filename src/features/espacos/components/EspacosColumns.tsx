'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { Espaco } from '../types';
import { Eye, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';

type GetColumnsProps = {
  onView: (espaco: Espaco) => void;
  onEdit: (espaco: Espaco) => void;
  canEdit: (espaco: Espaco) => boolean;
};

export const getColumns = ({ onView, onEdit, canEdit }: GetColumnsProps): ColumnDef<Espaco>[] => [
  {
    accessorKey: 'nome',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nome" />,
  },
  {
    accessorKey: 'departamento.nome',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Departamento" />,
  },
  {
    accessorKey: 'localizacao.nome',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Localização" />,
  },
  {
    accessorKey: 'tipoEspaco.nome',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tipo de Espaço" />,
  },
  // Updated Column for Array
  {
    accessorKey: 'tiposAtividade',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Atividades" />,
    cell: ({ row }) => {
      const atividades = row.original.tiposAtividade || [];
      // Show first 2, then +X more
      const visible = atividades.slice(0, 2);
      const remainder = atividades.length - 2;

      return (
        <div className="flex flex-wrap gap-1">
          {visible.map(t => <Badge key={t.id} variant="outline" className="text-[10px] px-1 py-0">{t.nome}</Badge>)}
          {remainder > 0 && (
            <span className="text-xs text-muted-foreground">
              +
              {remainder}
            </span>
          )}
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => {
      const espaco = row.original;

      return (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => onView(espaco)} title="Visualizar detalhes">
            <Eye className="h-4 w-4" />
            <span className="sr-only">Visualizar</span>
          </Button>
          {canEdit(espaco) && (
            <Button variant="ghost" size="icon" onClick={() => onEdit(espaco)} title="Editar espaço">
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Editar</span>
            </Button>
          )}
        </div>
      );
    },
  },
];
