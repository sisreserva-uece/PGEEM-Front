'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { Reserva } from '../types';
import { Check, HardDrive, Loader2, MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { InlineItemLink } from '@/components/ui/related-item-link';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetEquipamentoById } from '@/features/equipamentos/services/equipamentoService';
import { useGetEspacoById } from '@/features/espacos/services/espacoService';
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

function RecursoLink({ espacoId, equipamentoId }: { espacoId?: string; equipamentoId?: string }) {
  const { data: espaco, isLoading: isLoadingEspaco } = useGetEspacoById(espacoId ?? null);
  const { data: equipamento, isLoading: isLoadingEquipamento } = useGetEquipamentoById(equipamentoId ?? null);

  if (espacoId) {
    if (isLoadingEspaco) {
      return <Skeleton className="h-5 w-40" />;
    }
    if (!espaco) {
      return <span className="text-muted-foreground italic">Espaço desconhecido</span>;
    }
    return (
      <InlineItemLink
        href={`/dashboard/espacos?open=${espaco.id}`}
        icon={<MapPin className="h-3.5 w-3.5" />}
        title={espaco.nome}
      />
    );
  }

  if (equipamentoId) {
    if (isLoadingEquipamento) {
      return <Skeleton className="h-5 w-40" />;
    }
    if (!equipamento) {
      return <span className="text-muted-foreground italic">Equipamento desconhecido</span>;
    }
    return (
      <InlineItemLink
        href={`/dashboard/equipamentos?open=${equipamento.id}`}
        icon={<HardDrive className="h-3.5 w-3.5" />}
        title={`${equipamento.tipoEquipamento.nome} — ${equipamento.tombamento}`}
      />
    );
  }

  return <span className="text-muted-foreground italic">—</span>;
}

export const getSolicitacaoColumns = (): ColumnDef<Reserva>[] => [
  {
    id: 'recurso',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Recurso" />,
    cell: ({ row }) => (
      <RecursoLink
        espacoId={row.original.espacoId}
        equipamentoId={row.original.equipamentoId}
      />
    ),
  },
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
