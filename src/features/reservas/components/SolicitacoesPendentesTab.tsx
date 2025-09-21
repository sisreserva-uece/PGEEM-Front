'use client';

import type { SortingState } from '@tanstack/react-table';
import type { Espaco } from '@/features/espacos/types';
import { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { useGetSolicitacoesByEspaco } from '../services/reservaService';
import { ReservaStatus } from '../types';
import { getSolicitacaoColumns } from './SolicitacaoColumns';

type Props = {
  espaco: Espaco;
};

export function SolicitacoesPendentesTab({ espaco }: Props) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'dataInicio', desc: false }]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const { data, isLoading, isError, isFetching } = useGetSolicitacoesByEspaco({
    espacoId: espaco.id,
    statusCodigo: ReservaStatus.PENDENTE,
    page: pagination.pageIndex,
    size: pagination.pageSize,
    sortField: sorting[0]?.id ?? 'dataInicio',
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
  });

  const columns = getSolicitacaoColumns();

  return (
    <div>
      <h3 className="text-lg font-semibold">Solicitações Pendentes</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Aprove ou recuse as solicitações de reserva para este espaço.
      </p>
      <DataTable
        columns={columns}
        data={data?.content ?? []}
        pageCount={data?.totalPages ?? 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
        isLoading={isLoading || isFetching}
        isError={isError}
      />
    </div>
  );
}
