'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { Espaco } from '../types';
import { CalendarPlus, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { useUserAccess } from '@/features/auth/hooks/useUserAccess';

type GetColumnsProps = {
  onView: (espaco: Espaco) => void;
  onSolicitarReserva: (espaco: Espaco) => void;
};

export const getColumns = ({ onView, onSolicitarReserva }: GetColumnsProps): ColumnDef<Espaco>[] => [
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
      const { canMakeReservation } = useUserAccess();
      return (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => onView(espaco)} title="Visualizar detalhes">
            <Eye className="h-4 w-4" />
          </Button>
          {canMakeReservation && (
            <Button variant="ghost" size="icon" onClick={() => onSolicitarReserva(espaco)} title="Solicitar reserva">
              <CalendarPlus className="h-4 w-4" />
            </Button>
          )}
        </div>
      );
    },
  },
];
