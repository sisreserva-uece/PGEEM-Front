'use client';

import type { SortingState } from '@tanstack/react-table';
import type { Usuario } from '../types';
import { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { MasterDetailSheet } from '@/components/ui/master-detail-sheet';
import { useGetUsuarios } from '../services/usuarioService';
import { getUsuarioColumns } from './UsuarioColumns';
import { UsuarioForm } from './UsuarioForm';
import { UsuariosFilterBar } from './UsuariosFilterBar';
import { UsuarioMainDataView, UsuarioRelationsView } from './UsuarioView';

export function UsuariosPageClient() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<'view' | 'edit'>('edit');
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sorting, setSorting] = useState<SortingState>([{ id: 'nome', desc: false }]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const { data, isLoading, isError, isFetching } = useGetUsuarios({
    page: pagination.pageIndex,
    size: pagination.pageSize,
    sortField: sorting[0]?.id ?? 'nome',
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

  const handleView = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setSheetMode('view');
    setSheetOpen(true);
  };

  const handleEdit = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setSheetMode('edit');
    setSheetOpen(true);
  };

  const columns = getUsuarioColumns({ onView: handleView, onEdit: handleEdit });

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-4 md:p-8 md:flex">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gerenciar Usuários</h2>
          <p className="text-muted-foreground">Visualize e edite os usuários do sistema.</p>
        </div>
      </div>
      <UsuariosFilterBar filters={filters} onFilterChange={handleFilterChange} isFetching={isFetching} />
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
          key={selectedUsuario?.id}
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          entity={selectedUsuario}
          entityName="Usuário"
          initialMode={sheetMode}
          canEdit={true}
          FormComponent={UsuarioForm}
          MainDataViewComponent={UsuarioMainDataView}
          RelationsViewComponent={UsuarioRelationsView}
        />
      )}
    </div>
  );
}
