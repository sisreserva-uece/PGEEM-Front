'use client';

import type { SortingState } from '@tanstack/react-table';
import type { EquipamentoGenerico } from '../types';
import { PlusCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { MasterDetailSheet } from '@/components/ui/master-detail-sheet';
import { useUserAccess } from '@/features/auth/hooks/useUserAccess';
import { useGetAllEquipamentosGenericos } from '../services/equipamentoGenericoService';
import { getEquipamentoGenericoColumns } from './EquipamentoGenericoColumns';
import { EquipamentoGenericoForm } from './EquipamentoGenericoForm';
import { EquipamentoGenericoMainDataView } from './EquipamentoGenericoView';
import { EquipamentosGenericosFilterBar } from './EquipamentosGenericosFilterBar';

export function EquipamentosGenericosPageClient() {
  const access = useUserAccess();

  const [sheetState, setSheetState] = useState<{
    open: boolean;
    equipamento: EquipamentoGenerico | null;
  }>({ open: false, equipamento: null });
  const [sheetMode, setSheetMode] = useState<'view' | 'edit'>('view');

  const handleView = (equipamento: EquipamentoGenerico) => {
    setSheetState({ open: true, equipamento });
    setSheetMode('view');
  };

  const handleEdit = (equipamento: EquipamentoGenerico) => {
    setSheetState({ open: true, equipamento });
    setSheetMode('edit');
  };

  const handleCreate = () => {
    setSheetState({ open: true, equipamento: null });
    setSheetMode('edit');
  };

  const { data: allEquipamentosGenericos, isLoading, isError }
    = useGetAllEquipamentosGenericos();

  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'nome', desc: false },
  ]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const handleFilterChange = (key: string, value: any) => {
    setPagination(p => ({ ...p, pageIndex: 0 }));
    if (key === 'all') {
      return setFilters({});
    }
    setFilters((prev) => {
      const next = { ...prev };
      if (value) {
        next[key] = value;
      } else {
        delete next[key];
      }
      return next;
    });
  };

  const columns = getEquipamentoGenericoColumns({
    onView: handleView,
    onEdit: handleEdit,
    canView: true,
    canEdit: access.isAdmin,
  });

  const filteredData = useMemo(() => {
    if (!allEquipamentosGenericos) {
      return [];
    }
    let data = allEquipamentosGenericos;
    if (filters.nome) {
      data = data.filter(item =>
        item.nome.toLowerCase().includes(String(filters.nome).toLowerCase()),
      );
    }
    return data;
  }, [allEquipamentosGenericos, filters]);

  const pageCount = allEquipamentosGenericos
    ? Math.ceil(filteredData.length / pagination.pageSize)
    : 0;

  return (
    <div className="h-full flex-1 flex-col space-y-4 p-4 md:p-8 md:flex">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Equipamentos Genéricos
          </h2>
          <p className="text-muted-foreground">
            Gerencie o catálogo de itens por quantidade da instituição.
          </p>
        </div>
        {access.isAdmin && (
          <Button onClick={handleCreate}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Equipamento Genérico
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <EquipamentosGenericosFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          isFetching={isLoading}
        />
        <DataTable
          columns={columns}
          data={filteredData}
          pageCount={pageCount}
          pagination={pagination}
          onPaginationChange={setPagination}
          sorting={sorting}
          onSortingChange={setSorting}
          isLoading={isLoading}
          isError={isError}
          manualPagination={false}
          manualSorting={false}
        />
      </div>

      {sheetState.open && (
        <MasterDetailSheet
          key={sheetState.equipamento?.id ?? 'new-equipamento-generico'}
          open={sheetState.open}
          onOpenChange={isOpen =>
            setSheetState(s => ({ ...s, open: isOpen }))}
          entity={sheetState.equipamento}
          entityName="Equipamento Genérico"
          initialMode={sheetMode}
          canEdit={access.isAdmin}
          FormComponent={EquipamentoGenericoForm}
          MainDataViewComponent={EquipamentoGenericoMainDataView}
        />
      )}
    </div>
  );
}
