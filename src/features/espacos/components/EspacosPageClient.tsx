'use client';

import type { SortingState } from '@tanstack/react-table';
import type { Espaco } from '../types';
import { PlusCircle, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { MasterDetailSheet } from '@/components/ui/master-detail-sheet';
import { useUserAccess } from '@/features/auth/hooks/useUserAccess';
import { EspacoForm } from '@/features/espacos/components/EspacoForm';
import { EspacoMainDataView, EspacoRelationsView } from '@/features/espacos/components/EspacoView';
import { SolicitarReservaDialog } from '@/features/reservas/components/SolicitarReservaDialog';
import { useUrlTrigger } from '@/lib/hooks/useUrlTrigger';
import { useGetEspacos } from '../services/espacoService';
import { getColumns } from './EspacosColumns';
import { EspacosFilterBar } from './EspacosFilterBar';

export function EspacosPageClient() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [reservaDialogOpen, setReservaDialogOpen] = useState(false);
  const [selectedEspaco, setSelectedEspaco] = useState<Espaco | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sorting, setSorting] = useState<SortingState>([{ id: 'nome', desc: false }]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const access = useUserAccess();
  const handleFilterChange = (key: string, value: any) => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
    if (key === 'all') {
      setFilters({});
      return;
    }
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      if (value && value !== 'all') {
        newFilters[key] = value;
      } else {
        delete newFilters[key];
      }
      return newFilters;
    });
  };
  const handleOpenReservaDialog = (espaco: Espaco) => {
    setSelectedEspaco(espaco);
    setReservaDialogOpen(true);
  };
  const { data, isLoading, isError, isFetching, refetch } = useGetEspacos({
    page: pagination.pageIndex,
    size: pagination.pageSize,
    sortField: sorting[0]?.id ?? 'nome',
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
    ...filters,
  });
  const [openId, clearOpenId] = useUrlTrigger('open');
  const handleCreate = () => {
    setSelectedEspaco(null);
    setSheetOpen(true);
  };
  const handleView = (espaco: Espaco) => {
    setSelectedEspaco(espaco);
    setSheetOpen(true);
  };
  const columns = getColumns({ onView: handleView, onSolicitarReserva: handleOpenReservaDialog });
  const pageCount = data?.totalPages ?? 0;
  const isDataLoading = isLoading || isFetching || access.isLoading;
  useEffect(() => {
    if (openId && data?.content) {
      const entityToOpen = data.content.find(item => item.id === openId);
      if (entityToOpen) {
        handleView(entityToOpen);
        clearOpenId();
      }
    }
  }, [openId, data?.content, clearOpenId]);
  return (
    <div className="h-full flex-1 flex-col space-y-8 p-4 md:p-8 md:flex">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Buscar Espaços</h2>
          <p className="text-muted-foreground">
            Visualize os espaços disponíveis e solicite sua reserva.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => refetch()} disabled={isDataLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isDataLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          {access.canCreateEspaco && (
            <Button onClick={handleCreate}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Espaço
            </Button>
          )}
        </div>
      </div>
      <EspacosFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        isFetching={isDataLoading}
      />
      <DataTable
        columns={columns}
        data={data?.content ?? []}
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
        isLoading={isDataLoading}
        isError={isError}
      />
      {sheetOpen && (
        <MasterDetailSheet
          key={selectedEspaco?.id ?? 'new'}
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          entity={selectedEspaco}
          entityName="Espaço"
          initialMode={selectedEspaco ? 'view' : 'edit'}
          canEdit={false}
          FormComponent={EspacoForm}
          MainDataViewComponent={EspacoMainDataView}
          RelationsViewComponent={props => (
            <EspacoRelationsView {...props} onSolicitarReserva={handleOpenReservaDialog} />
          )}
        />
      )}
      {selectedEspaco && (
        <SolicitarReservaDialog
          espaco={selectedEspaco}
          open={reservaDialogOpen}
          onOpenChange={setReservaDialogOpen}
        />
      )}
    </div>
  );
}
