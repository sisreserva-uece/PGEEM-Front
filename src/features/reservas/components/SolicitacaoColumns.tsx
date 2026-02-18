'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { Reserva } from '../types';
import { Check, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetUserById } from '@/features/usuarios/services/usuarioService';
import { parseUtcToLocal } from '@/lib/dateUtils';
import { useUpdateSolicitacaoStatus } from '../services/reservaService';
import { ReservaStatus } from '../types';

const formatDateTime = (dateString: string) =>
  parseUtcToLocal(dateString).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

function SolicitanteName({ userId }: { userId: string }) {
  const { data: user, isLoading } = useGetUserById(userId);
  if (isLoading) {
    return <Skeleton className="h-5 w-32" />;
  }
  return <span>{user?.nome ?? 'Desconhecido'}</span>;
}

export const getSolicitacaoColumns = (): ColumnDef<Reserva>[] => [
  {
    accessorKey: 'usuarioSolicitanteId',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Solicitante" />,
    cell: ({ row }) => <SolicitanteName userId={row.original.usuarioSolicitanteId} />,
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
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => {
      const solicitacao = row.original;
      const mutation = useUpdateSolicitacaoStatus();

      const handleUpdateStatus = (status: ReservaStatus) => {
        mutation.mutate({ id: solicitacao.id, status });
      };

      const isProcessing = mutation.isPending && mutation.variables?.id === solicitacao.id;

      if (isProcessing) {
        return <Loader2 className="h-4 w-4 animate-spin" />;
      }

      return (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-green-600 hover:text-green-700"
            onClick={() => handleUpdateStatus(ReservaStatus.APROVADO)}
            title="Aprovar"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-600 hover:text-red-700"
            onClick={() => handleUpdateStatus(ReservaStatus.RECUSADO)}
            title="Recusar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
