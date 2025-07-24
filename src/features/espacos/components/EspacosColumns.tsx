'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { Espaco } from '../types';
import type { PermissionChecks } from '@/features/auth/hooks/usePermissions';
import { Eye, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';

type GetColumnsProps = {
  onView: (espaco: Espaco) => void;
  onEdit: (espaco: Espaco) => void;
  permissions: PermissionChecks<'espacos'>;
};

export const getColumns = ({ onView, onEdit, permissions }: GetColumnsProps): ColumnDef<Espaco>[] => [
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
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => {
      const espaco = row.original;
      return (
        <div className="flex items-center space-x-2">
          {permissions.canView && (
            <Button variant="ghost" size="icon" onClick={() => onView(espaco)}>
              <Eye className="h-4 w-4" />
            </Button>
          )}
          {permissions.canEdit && (
            <Button variant="ghost" size="icon" onClick={() => onEdit(espaco)}>
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
      );
    },
  },
];
