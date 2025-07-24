'use client';

import type { SortingState } from '@tanstack/react-table';
import type { Espaco } from '../types';
import { PlusCircle, RefreshCw } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { MasterDetailSheet } from '@/components/ui/master-detail-sheet';
import { usePermissions } from '@/features/auth/hooks/usePermissions';
import { EspacoForm } from '@/features/espacos/components/EspacoForm';
import { EspacoView } from '@/features/espacos/components/EspacoView';
import { useGetEspacos } from '../services/espacoService';
import { getColumns } from './EspacosColumns';
import { EspacosFilterBar } from './EspacosFilterBar';

export function EspacosPageClient() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<'view' | 'edit'>('edit');
  const [selectedEspaco, setSelectedEspaco] = useState<Espaco | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sorting, setSorting] = useState<SortingState>([{ id: 'nome', desc: false }]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
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
  const permissions = usePermissions('espacos');
  const { data, isLoading, isError, isFetching, refetch } = useGetEspacos({
    page: pagination.pageIndex,
    size: pagination.pageSize,
    sortField: sorting[0]?.id ?? 'nome',
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
    ...filters,
  });
  const handleCreate = () => {
    setSelectedEspaco(null);
    setSheetMode('edit');
    setSheetOpen(true);
  };
  const handleView = (espaco: Espaco) => {
    setSelectedEspaco(espaco);
    setSheetMode('view');
    setSheetOpen(true);
  };
  const handleEdit = (espaco: Espaco) => {
    setSelectedEspaco(espaco);
    setSheetMode('edit');
    setSheetOpen(true);
  };
  const columns = getColumns({ onView: handleView, onEdit: handleEdit, permissions });
  const pageCount = data?.totalPages ?? 0;
  const isDataLoading = isLoading || isFetching;
  useEffect(() => {
    const openId = searchParams.get('open');
    if (openId && data?.content) {
      const entityToOpen = data.content.find(item => item.id === openId);
      if (entityToOpen) {
        setSelectedEspaco(entityToOpen);
        setSheetMode('view');
        setSheetOpen(true);
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete('open');
        router.replace(`/dashboard/espacos?${newParams.toString()}`, { scroll: false });
      }
    }
  }, [searchParams, data, router]);
  return (
    <div className="h-full flex-1 flex-col space-y-8 p-4 md:p-8 md:flex">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gerenciar Espaços</h2>
          <p className="text-muted-foreground">
            Visualize, crie e edite os espaços da instituição.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => refetch()} disabled={isDataLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isDataLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          {permissions.canCreate && (
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
          initialMode={sheetMode}
          canEdit={permissions.canEdit}
          ViewComponent={EspacoView}
          FormComponent={EspacoForm}
        />
      )}
    </div>
  );
}
