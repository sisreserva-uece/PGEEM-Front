'use client';

import type { SortingState } from '@tanstack/react-table';
import type { Espaco } from '@/features/espacos/types';
import { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import { useGetSolicitacoesByEspaco, useGetSolicitacoesByEspacoEquipamentos } from '../services/reservaService';
import { ReservaStatus } from '../types';
import { getSolicitacaoColumns } from './SolicitacaoColumns';

type Props = {
  espaco: Espaco;
};

export function SolicitacoesPendentesTab({ espaco }: Props) {
  const [espacoSorting, setEspacoSorting] = useState<SortingState>([{ id: 'dataInicio', desc: false }]);
  const [espacoPagination, setEspacoPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const [equipSorting, setEquipSorting] = useState<SortingState>([{ id: 'dataInicio', desc: false }]);
  const [equipPagination, setEquipPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const { data: espacoData, isLoading: isLoadingEspaco, isError: isErrorEspaco, isFetching: isFetchingEspaco }
    = useGetSolicitacoesByEspaco({
      espacoId: espaco.id,
      statusCodigo: ReservaStatus.PENDENTE,
      page: espacoPagination.pageIndex,
      size: espacoPagination.pageSize,
      sortField: espacoSorting[0]?.id ?? 'dataInicio',
      sortOrder: espacoSorting[0]?.desc ? 'desc' : 'asc',
    });

  const { data: equipData, isLoading: isLoadingEquip, isError: isErrorEquip, isFetching: isFetchingEquip }
    = useGetSolicitacoesByEspacoEquipamentos({
      espacoDoEquipamentoId: espaco.id,
      statusCodigo: ReservaStatus.PENDENTE,
      page: equipPagination.pageIndex,
      size: equipPagination.pageSize,
      sortField: equipSorting[0]?.id ?? 'dataInicio',
      sortOrder: equipSorting[0]?.desc ? 'desc' : 'asc',
    });

  const columns = getSolicitacaoColumns();

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold">Reservas do Espaço</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Aprove ou recuse as solicitações de reserva para este espaço.
        </p>
        <DataTable
          columns={columns}
          data={espacoData?.content ?? []}
          pageCount={espacoData?.totalPages ?? 0}
          pagination={espacoPagination}
          onPaginationChange={setEspacoPagination}
          sorting={espacoSorting}
          onSortingChange={setEspacoSorting}
          isLoading={isLoadingEspaco || isFetchingEspaco}
          isError={isErrorEspaco}
        />
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold">Reservas de Equipamentos</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Aprove ou recuse as solicitações de empréstimo para os equipamentos alocados neste espaço.
        </p>
        <DataTable
          columns={columns}
          data={equipData?.content ?? []}
          pageCount={equipData?.totalPages ?? 0}
          pagination={equipPagination}
          onPaginationChange={setEquipPagination}
          sorting={equipSorting}
          onSortingChange={setEquipSorting}
          isLoading={isLoadingEquip || isFetchingEquip}
          isError={isErrorEquip}
        />
      </div>
    </div>
  );
}
