'use client';

import type { PaginationState } from '@tanstack/react-table';
import type { TipoEquipamento } from '../types';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { MasterDetailSheet } from '@/components/ui/master-detail-sheet';
import { useGetTiposEquipamento } from '../services/equipamentoService';
import { getTipoEquipamentoColumns } from './TipoEquipamentoColumns';
import { TipoEquipamentoForm } from './TipoEquipamentoForm';
import { TipoEquipamentoMainDataView } from './TipoEquipamentoView';

export function ManageTiposTab() {
  const [sheetState, setSheetState] = useState<{ open: boolean; tipo: TipoEquipamento | null }>({
    open: false,
    tipo: null,
  });

  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const { data: tiposData, isLoading, isFetching } = useGetTiposEquipamento({
    sortField: 'nome',
    page: pagination.pageIndex,
    size: pagination.pageSize,
  });

  const handleEdit = (tipo: TipoEquipamento) => setSheetState({ open: true, tipo });
  const handleCreate = () => setSheetState({ open: true, tipo: null });
  const handleCloseSheet = () => setSheetState({ open: false, tipo: null });

  const tipoColumns = getTipoEquipamentoColumns({ onEdit: handleEdit });
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
          entityName="Tipo de Equipamento"
          initialMode="edit"
          canEdit={true}
          FormComponent={TipoEquipamentoForm}
          MainDataViewComponent={TipoEquipamentoMainDataView}
        />
      )}
    </>
  );
}
