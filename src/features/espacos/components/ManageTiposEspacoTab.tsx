'use client';

import type { PaginationState } from '@tanstack/react-table';
import type { TipoEspaco } from '../types';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { MasterDetailSheet } from '@/components/ui/master-detail-sheet';
import { useGetTiposEspaco } from '../services/espacoService';
import { getTipoEspacoColumns } from './TipoEspacoColumns';
import { TipoEspacoForm } from './TipoEspacoForm';

function TipoEspacoMainDataView() {
  return null;
}

export function ManageTiposEspacoTab() {
  const [sheetState, setSheetState] = useState<{ open: boolean; tipo: TipoEspaco | null }>({
    open: false,
    tipo: null,
  });
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  const { data: tiposData, isLoading, isFetching } = useGetTiposEspaco({
    sortField: 'nome',
    page: pagination.pageIndex,
    size: pagination.pageSize,
  });

  const handleEdit = (tipo: TipoEspaco) => setSheetState({ open: true, tipo });
  const handleCreate = () => setSheetState({ open: true, tipo: null });
  const handleCloseSheet = () => setSheetState({ open: false, tipo: null });

  const tipoColumns = getTipoEspacoColumns({ onEdit: handleEdit });
  const isDataLoading = isLoading || isFetching;

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={handleCreate}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Tipo
        </Button>
      </div>
      <DataTable
        columns={tipoColumns}
        data={tiposData?.content ?? []}
        isLoading={isDataLoading}
        pageCount={tiposData?.totalPages ?? 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={[]}
        onSortingChange={() => {}}
      />
      {sheetState.open && (
        <MasterDetailSheet
          key={sheetState.tipo?.id ?? 'new-tipo'}
          open={sheetState.open}
          onOpenChange={isOpen => !isOpen && handleCloseSheet()}
          entity={sheetState.tipo}
          entityName="Tipo de Espaço"
          initialMode="edit"
          canEdit={true}
          FormComponent={TipoEspacoForm}
          MainDataViewComponent={TipoEspacoMainDataView}
        />
      )}
    </>
  );
}
