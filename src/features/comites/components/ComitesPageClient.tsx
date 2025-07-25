'use client';

import type { SortingState } from '@tanstack/react-table';
import type { Comite } from '../types';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { MasterDetailSheet } from '@/components/ui/master-detail-sheet';
import { useGetComites } from '../services/comiteService';
import { getComiteColumns } from './ComiteColumns';
import { ComiteForm } from './ComiteForm';
import { ComitesFilterBar } from './ComitesFilterBar';
import { ComiteMainDataView, ComiteRelationsView } from './ComiteView';

export function ComitesPageClient() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<'view' | 'edit'>('edit');
  const [selectedComite, setSelectedComite] = useState<Comite | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sorting, setSorting] = useState<SortingState>([{ id: 'descricao', desc: false }]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const { data, isLoading, isError, isFetching } = useGetComites({
    page: pagination.pageIndex,
    size: pagination.pageSize,
    sortField: sorting[0]?.id ?? 'descricao',
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
    ...filters,
  });

  const handleFilterChange = (key: string, value: any) => {
    setPagination(p => ({ ...p, pageIndex: 0 }));
    if (key === 'all') {
      return setFilters({});
    }
    setFilters(prev => ({ ...prev, [key]: value || undefined }));
  };

  const handleCreate = () => {
    setSelectedComite(null);
    setSheetMode('edit');
    setSheetOpen(true);
  };
  const handleView = (comite: Comite) => {
    setSelectedComite(comite);
    setSheetMode('view');
    setSheetOpen(true);
  };
  const handleEdit = (comite: Comite) => {
    setSelectedComite(comite);
    setSheetMode('edit');
    setSheetOpen(true);
  };

  const columns = getComiteColumns({ onView: handleView, onEdit: handleEdit });

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-4 md:p-8 md:flex">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gerenciar Comitês</h2>
          <p className="text-muted-foreground">Visualize e gerencie os comitês da instituição.</p>
        </div>
        <Button onClick={handleCreate}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Comitê
        </Button>
      </div>
      <ComitesFilterBar filters={filters} onFilterChange={handleFilterChange} isFetching={isFetching} />
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
      {sheetOpen && (
        <MasterDetailSheet
          key={selectedComite?.id ?? 'new'}
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          entity={selectedComite}
          entityName="Comitê"
          initialMode={sheetMode}
          canEdit={true}
          FormComponent={ComiteForm}
          MainDataViewComponent={ComiteMainDataView}
          RelationsViewComponent={ComiteRelationsView}
        />
      )}
    </div>
  );
}
