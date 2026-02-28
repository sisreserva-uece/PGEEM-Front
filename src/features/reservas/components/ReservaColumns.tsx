'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { Reserva } from '../types';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ReservaStatusMap } from '../types';

const formatDateTime = (dateString: string) =>
  new Date(dateString).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

type GetColumnsProps = {
  onView: (reserva: Reserva) => void;
  espacosMap: Map<string, string>;
};

export const getReservaColumns = ({ onView, espacosMap }: GetColumnsProps): ColumnDef<Reserva>[] => [
  {
    accessorKey: 'espacoId',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Espaço" />,
    cell: ({ row }) => {
      const espacoId = row.original.espacoId;
      return espacosMap.get(espacoId as string) ?? espacoId;
    },
  },
  {
    accessorKey: 'dataInicio',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Início" />,
    cell: ({ row }) => formatDateTime(row.original.dataInicio),
  },
  {
    accessorKey: 'dataFim',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Fim" />,
    cell: ({ row }) => formatDateTime(row.original.dataFim),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const statusInfo = ReservaStatusMap[row.original.status] ?? {
        label: 'Desconhecido',
        className: 'bg-gray-400',
      };
      return <Badge className={`${statusInfo.className} text-white`}>{statusInfo.label}</Badge>;
    },
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => (
      <Button variant="ghost" size="icon" onClick={() => onView(row.original)}>
        <Eye className="h-4 w-4" />
        <span className="sr-only">Visualizar Detalhes</span>
      </Button>
    ),
  },
];
