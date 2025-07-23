'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { Espaco } from '../types';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type RowActionsProps = {
  row: { original: Espaco };
  onEdit: (espaco: Espaco) => void;
  onDelete: (espaco: Espaco) => void;
};

function RowActions({ row, onEdit, onDelete }: RowActionsProps) {
  const espaco = row.original;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onEdit(espaco)}>
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-600" onClick={() => onDelete(espaco)}>
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const getColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (espaco: Espaco) => void;
  onDelete: (espaco: Espaco) => void;
}): ColumnDef<Espaco>[] => [
  {
    accessorKey: 'nome',
    header: 'Nome',
  },
  {
    accessorKey: 'departamento.nome',
    header: 'Departamento',
  },
  {
    accessorKey: 'localizacao.nome',
    header: 'Localização',
  },
  {
    accessorKey: 'tipoEspaco.nome',
    header: 'Tipo de Espaço',
  },
  {
    id: 'actions',
    cell: ({ row }) => <RowActions row={row} onEdit={onEdit} onDelete={onDelete} />,
  },
];
