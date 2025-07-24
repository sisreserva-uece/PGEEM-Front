'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { TipoEquipamento } from '../types';
import { Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';

type GetTipoEquipamentoColumnsProps = {
  onEdit: (tipo: TipoEquipamento) => void;
};

export const getTipoEquipamentoColumns = ({ onEdit }: GetTipoEquipamentoColumnsProps): ColumnDef<TipoEquipamento>[] => [
  {
    accessorKey: 'nome',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nome" />,
  },
  {
    accessorKey: 'isDetalhamentoObrigatorio',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Detalhamento Obrigatório" />,
    cell: ({ row }) => {
      const isRequired = row.original.isDetalhamentoObrigatorio;
      return isRequired ? <Badge>Sim</Badge> : <Badge variant="secondary">Não</Badge>;
    },
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
