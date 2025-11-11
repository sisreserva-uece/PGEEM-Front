// In src/features/complexos/components/ComplexosPageClient.tsx
'use client';

import type { SortingState } from '@tanstack/react-table';
import type { Complexo } from '../types';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { MasterDetailSheet } from '@/components/ui/master-detail-sheet'; // Import MasterDetailSheet
import { useUserAccess } from '@/features/auth/hooks/useUserAccess';
import { useGetComplexos } from '../services/complexoService';
import { getComplexoColumns } from './ComplexoColumns';
import { ComplexoForm } from './ComplexoForm'; // Import the new Form
import { ComplexosFilterBar } from './ComplexosFilterBar';
import { ComplexoMainDataView, ComplexoRelationsView } from './ComplexoView'; // Import the new View

export function ComplexosPageClient() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<'view' | 'edit'>('edit');
  const [selectedComplexo, setSelectedComplexo] = useState<Complexo | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sorting, setSorting] = useState<SortingState>([{ id: 'nome', desc: false }]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const access = useUserAccess();

  const handleFilterChange = (key: string, value: any) => {
    setPagination(p => ({ ...p, pageIndex: 0 }));
    if (key === 'all') {
      return setFilters({});
    }
    setFilters((prev) => {
      const newFilters = { ...prev };
      if (value) {
        newFilters[key] = value;
      } else {
        delete newFilters[key];
      }
      return newFilters;
    });
  };

  const { data, isLoading, isError, isFetching } = useGetComplexos({
    page: pagination.pageIndex,
    size: pagination.pageSize,
    sortField: sorting[0]?.id ?? 'nome',
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
    ...filters,
  });

  const handleCreate = () => {
    setSelectedComplexo(null);
    setSheetMode('edit');
    setSheetOpen(true);
  };

  const handleView = (complexo: Complexo) => {
    setSelectedComplexo(complexo);
    setSheetMode('view');
    setSheetOpen(true);
  };

  const handleEdit = (complexo: Complexo) => {
    setSelectedComplexo(complexo);
    setSheetMode('edit');
    setSheetOpen(true);
  };

  const columns = getComplexoColumns({
    onView: handleView,
    onEdit: handleEdit,
    canEdit: access.canManageComplexos,
  });

  const pageCount = data?.totalPages ?? 0;
  const isDataLoading = isLoading || isFetching;

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-4 md:p-8 md:flex">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gerenciar Complexos</h2>
          <p className="text-muted-foreground">Crie e gerencie complexos de espaços.</p>
        </div>
        {access.canManageComplexos && (
          <Button onClick={handleCreate}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Complexo
          </Button>
        )}
      </div>
      <ComplexosFilterBar
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
          key={selectedComplexo?.id ?? 'new'}
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          entity={selectedComplexo}
          entityName="Complexo"
          initialMode={sheetMode}
          canEdit={access.canManageComplexos}
          FormComponent={ComplexoForm}
          MainDataViewComponent={ComplexoMainDataView}
          RelationsViewComponent={ComplexoRelationsView}
        />
      )}
    </div>
  );
}
