'use client';

import type { SortingState } from '@tanstack/react-table';
import type { Reserva } from '../types';
import { useMemo, useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { MasterDetailSheet } from '@/components/ui/master-detail-sheet';
import { useGetAllEspacos } from '@/features/espacos/services/espacoService';
import { useGetMyReservations } from '../services/reservaService';
import { getReservaColumns } from './ReservaColumns';
import { ReservaForm, ReservaMainDataView } from './ReservaView';

export function ReservasPageClient() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState<Reserva | null>(null);
  const [sorting, setSorting] = useState<SortingState>([{ id: 'dataInicio', desc: true }]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const { data, isLoading, isError, isFetching } = useGetMyReservations({
    page: pagination.pageIndex,
    size: pagination.pageSize,
    sortField: sorting[0]?.id ?? 'dataInicio',
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
  });

  // Fetch all espacos to create a lookup map
  const { data: allEspacos, isLoading: isLoadingEspacos } = useGetAllEspacos();
  const espacosMap = useMemo(() => {
    if (!allEspacos) {
      return new Map<string, string>();
    }
    return new Map(allEspacos.map(e => [e.id, e.nome]));
  }, [allEspacos]);

  const handleView = (reserva: Reserva) => {
    setSelectedReserva(reserva);
    setSheetOpen(true);
  };

  const columns = getReservaColumns({ onView: handleView, espacosMap });
  const isDataLoading = isLoading || isFetching || isLoadingEspacos;

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-4 md:p-8 md:flex">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Minhas Reservas</h2>
          <p className="text-muted-foreground">Acompanhe o status de suas solicitações de reserva.</p>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={data?.content ?? []}
        pageCount={data?.totalPages ?? 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
        isLoading={isDataLoading}
        isError={isError}
      />
      {sheetOpen && (
        <MasterDetailSheet
          key={selectedReserva?.id}
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          entity={selectedReserva}
          entityName="Reserva"
          initialMode="view"
          canEdit={false}
          FormComponent={ReservaForm}
          MainDataViewComponent={ReservaMainDataView}
        />
      )}
    </div>
  );
}
