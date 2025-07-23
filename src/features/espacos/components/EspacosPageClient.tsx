'use client';

import type { SortingState } from '@tanstack/react-table';
import type { Espaco } from '../types';
import { PlusCircle, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { DataTable } from '@/components/ui/data-table';
import { useDeleteEspaco, useGetEspacos } from '../services/espacoService';
import { getColumns } from './Columns';
import { ManageEspacoSheet } from './ManageEspacoSheet';

export function EspacosPageClient() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedEspaco, setSelectedEspaco] = useState<Espaco | null>(null);
  const [espacoToDelete, setEspacoToDelete] = useState<Espaco | null>(null);
  const [sorting, setSorting] = useState<SortingState>([{ id: 'nome', desc: false }]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data, isLoading, isError, isFetching, refetch } = useGetEspacos({
    page: pagination.pageIndex,
    size: pagination.pageSize,
    sortField: sorting[0]?.id ?? 'nome',
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
  });
  const deleteMutation = useDeleteEspaco();
  const handleEdit = (espaco: Espaco) => {
    setSelectedEspaco(espaco);
    setSheetOpen(true);
  };
  const handleDelete = () => {
    if (!espacoToDelete) {
      return;
    }
    const promise = deleteMutation.mutateAsync(espacoToDelete.id);
    toast.promise(promise, {
      loading: 'Excluindo espaço...',
      success: 'Espaço excluído com sucesso!',
      error: err => `Erro ao excluir espaço: ${err.message}`,
    });
    setEspacoToDelete(null);
  };
  const promptDelete = (espaco: Espaco) => {
    setEspacoToDelete(espaco);
  };
  const handleCreate = () => {
    setSelectedEspaco(null);
    setSheetOpen(true);
  };
  const columns = getColumns({ onEdit: handleEdit, onDelete: promptDelete });
  const pageCount = data?.totalPages ?? 0;
  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gerenciar Espaços</h2>
          <p className="text-muted-foreground">
            Visualize, crie, edite e exclua os espaços da instituição.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`}
            />
            Atualizar
          </Button>
          <Button onClick={handleCreate}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Espaço
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={data?.content ?? []}
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
        isLoading={isLoading || isFetching}
        isError={isError}
      />
      <ManageEspacoSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        espaco={selectedEspaco}
      />
      <ConfirmationDialog
        open={!!espacoToDelete}
        onOpenChange={() => setEspacoToDelete(null)}
        onConfirm={handleDelete}
        title={`Tem certeza que deseja excluir "${espacoToDelete?.nome}"?`}
        description="Esta ação não pode ser desfeita. O espaço será permanentemente removido."
      />
    </div>
  );
}
