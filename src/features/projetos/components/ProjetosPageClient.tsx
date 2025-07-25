'use client';

import type { SortingState } from '@tanstack/react-table';
import type { Projeto } from '../types';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { MasterDetailSheet } from '@/components/ui/master-detail-sheet';
import { useUserAccess } from '@/features/auth/hooks/useUserAccess';
import { useGetProjetos } from '../services/projetoService';
import { getProjetoColumns } from './ProjetoColumns';
import { ProjetoForm } from './ProjetoForm';
import { ProjetoMainDataView } from './ProjetoView';

export function ProjetosPageClient() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedProjeto, setSelectedProjeto] = useState<Projeto | null>(null);
  const [sorting, setSorting] = useState<SortingState>([{ id: 'nome', desc: false }]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const access = useUserAccess();
  const { data, isLoading, isError, isFetching } = useGetProjetos({
    page: pagination.pageIndex,
    size: pagination.pageSize,
    sortField: sorting[0]?.id ?? 'nome',
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
  });

  const handleCreate = () => {
    setSelectedProjeto(null);
    setSheetOpen(true);
  };

  const handleView = (projeto: Projeto) => {
    setSelectedProjeto(projeto);
    setSheetOpen(true);
  };

  const columns = getProjetoColumns({ onView: handleView });
  const isDataLoading = isLoading || isFetching;

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-4 md:p-8 md:flex">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gerenciar Projetos</h2>
          <p className="text-muted-foreground">Visualize e crie projetos de pesquisa e extensão.</p>
        </div>
        {access.canManageProjetos && (
          <Button onClick={handleCreate}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Projeto
          </Button>
        )}
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
          key={selectedProjeto?.id ?? 'new-projeto'}
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          entity={selectedProjeto}
          entityName="Projeto"
          initialMode={selectedProjeto ? 'view' : 'edit'}
          canEdit={false}
          FormComponent={ProjetoForm}
          MainDataViewComponent={ProjetoMainDataView}
        />
      )}
    </div>
  );
}
