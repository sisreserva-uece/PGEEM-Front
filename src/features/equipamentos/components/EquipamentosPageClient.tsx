'use client';

import type { PaginationState, SortingState } from '@tanstack/react-table';
import type { Equipamento, TipoEquipamento } from '../types';
import { PlusCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePermissions } from '@/features/auth/hooks/usePermissions';
import { useGetEquipamentos, useGetTiposEquipamento } from '../services/equipamentoService';
import { getEquipamentoColumns } from './EquipamentoColumns';
import { EquipamentosFilterBar } from './EquipamentosFilterBar';
import { EquipamentoSheet } from './EquipamentoSheet';
import { getTipoEquipamentoColumns } from './TipoEquipamentoColumns';
import { TipoEquipamentoSheet } from './TipoEquipamentoSheet';

export function EquipamentosPageClient() {
  const permissions = usePermissions('equipamentos');
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') === 'tipos' && permissions.canManageTipos ? 'tipos' : 'equipamentos';
  const [tipoSheetState, setTipoSheetState] = useState<{ open: boolean; tipo: TipoEquipamento | null }>({ open: false, tipo: null });
  const [tiposPagination, setTiposPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const { data: tiposData, isLoading: isLoadingTipos, isFetching: isFetchingTipos } = useGetTiposEquipamento({
    sortField: 'nome',
    page: tiposPagination.pageIndex,
    size: tiposPagination.pageSize,
  });
  const tipoColumns = getTipoEquipamentoColumns({ onEdit: tipo => setTipoSheetState({ open: true, tipo }) });
  const [sheetState, setSheetState] = useState<{ open: boolean; equipamento: Equipamento | null }>({ open: false, equipamento: null });
  const [sheetMode, setSheetMode] = useState<'view' | 'edit'>('edit');
  const handleView = (equipamento: Equipamento) => {
    setSheetState({ open: true, equipamento });
    setSheetMode('view');
  };
  const handleEdit = (equipamento: Equipamento) => {
    setSheetState({ open: true, equipamento });
    setSheetMode('edit');
  };
  const handleCreate = () => {
    setSheetState({ open: true, equipamento: null });
    setSheetMode('edit');
  };
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sorting, setSorting] = useState<SortingState>([{ id: 'tombamento', desc: false }]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
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
  const { data: equipamentosData, isLoading: isLoadingEquipamentos, isFetching: isFetchingEquipamentos, isError: isErrorEquipamentos } = useGetEquipamentos({
    page: pagination.pageIndex,
    size: pagination.pageSize,
    sortField: sorting[0]?.id ?? 'tombamento',
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
    ...filters,
  });
  const equipamentoColumns = getEquipamentoColumns({
    onView: handleView,
    onEdit: handleEdit,
    permissions,
  });
  const handleTabChange = (tab: string) => {
    router.push(`/dashboard/equipamentos?tab=${tab}`);
  };
  return (
    <div className="h-full flex-1 flex-col space-y-4 p-4 md:p-8 md:flex">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gerenciar Equipamentos</h2>
          <p className="text-muted-foreground">Visualize e gerencie os equipamentos da instituição.</p>
        </div>
        {permissions.canCreate && (
          <Button onClick={handleCreate}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {' '}
            Novo Equipamento
          </Button>
        )}
      </div>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        {permissions.canManageTipos && (
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="equipamentos">Equipamentos</TabsTrigger>
            <TabsTrigger value="tipos">Tipos de Equipamento</TabsTrigger>
          </TabsList>
        )}
        <TabsContent value="equipamentos" className="mt-4">
          <div className="space-y-4">
            <EquipamentosFilterBar filters={filters} onFilterChange={handleFilterChange} isFetching={isFetchingEquipamentos} />
            <DataTable
              columns={equipamentoColumns}
              data={equipamentosData?.content ?? []}
              pageCount={equipamentosData?.totalPages ?? 0}
              pagination={pagination}
              onPaginationChange={setPagination}
              sorting={sorting}
              onSortingChange={setSorting}
              isLoading={isLoadingEquipamentos || isFetchingEquipamentos}
              isError={isErrorEquipamentos}
            />
          </div>
        </TabsContent>
        {permissions.canManageTipos && (
          <TabsContent value="tipos" className="mt-4">
            <div className="flex justify-end mb-4">
              <Button onClick={() => setTipoSheetState({ open: true, tipo: null })}>
                <PlusCircle className="mr-2 h-4 w-4" />
                {' '}
                Novo Tipo
              </Button>
            </div>
            <DataTable
              columns={tipoColumns}
              data={tiposData?.content ?? []}
              isLoading={isLoadingTipos || isFetchingTipos}
              pageCount={tiposData?.totalPages ?? 0}
              pagination={tiposPagination}
              onPaginationChange={setTiposPagination}
              sorting={[]}
              onSortingChange={() => {}}
            />
          </TabsContent>
        )}
      </Tabs>
      {tipoSheetState.open && (
        <TipoEquipamentoSheet key={tipoSheetState.tipo?.id ?? 'new-tipo'} open={tipoSheetState.open} onOpenChange={isOpen => setTipoSheetState({ ...tipoSheetState, open: isOpen })} tipo={tipoSheetState.tipo} />
      )}
      {sheetState.open && (
        <EquipamentoSheet
          key={sheetState.equipamento?.id ?? 'new-equipamento'}
          open={sheetState.open}
          onOpenChange={isOpen => setSheetState({ ...sheetState, open: isOpen })}
          equipamento={sheetState.equipamento}
          initialMode={sheetMode}
        />
      )}
    </div>
  );
}
