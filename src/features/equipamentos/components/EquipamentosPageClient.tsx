'use client';

import type { SortingState } from '@tanstack/react-table';
import type { Equipamento, TipoEquipamento } from '../types';
import { PlusCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { MasterDetailSheet } from '@/components/ui/master-detail-sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserAccess } from '@/features/auth/hooks/useUserAccess';
import { EquipamentoForm } from '@/features/equipamentos/components/EquipamentoForm';
import { EquipamentoMainDataView, EquipamentoRelationsView } from '@/features/equipamentos/components/EquipamentoView';
import { useUrlTrigger } from '@/lib/hooks/useUrlTrigger';
import { useGetAllEquipamentos, useGetEquipamentoById } from '../services/equipamentoService';
import { getEquipamentoColumns } from './EquipamentoColumns';
import { EquipamentosFilterBar } from './EquipamentosFilterBar';
import { ManageTiposTab } from './ManageTiposTab';

export function EquipamentosPageClient() {
  const access = useUserAccess();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab
    = searchParams.get('tab') === 'tipos' && access.canManageTiposEquipamento
      ? 'tipos'
      : 'equipamentos';

  const [sheetState, setSheetState] = useState<{
    open: boolean;
    equipamento: Equipamento | null;
  }>({ open: false, equipamento: null });
  const [sheetMode, setSheetMode] = useState<'view' | 'edit'>('view');

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

  const { data: allEquipamentos, isLoading, isError } = useGetAllEquipamentos();

  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sorting, setSorting] = useState<SortingState>([{ id: 'tombamento', desc: false }]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

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

  const equipamentoColumns = getEquipamentoColumns({
    onView: handleView,
    onEdit: handleEdit,
    canView: access.canViewEquipamento,
    canEdit: access.canEditEquipamento,
  });

  const [openId, clearOpenId] = useUrlTrigger('open');
  const {
    data: openedEntity,
    isLoading: isLoadingOpenedEntity,
    isError: isErrorOpenedEntity,
  } = useGetEquipamentoById(openId);

  useEffect(() => {
    if (isLoadingOpenedEntity) {
      toast.loading('Carregando equipamento...', { id: 'loading-entity' });
      return;
    }
    toast.dismiss('loading-entity');
    if (openedEntity) {
      handleView(openedEntity);
      clearOpenId();
    }
    if (isErrorOpenedEntity) {
      toast.error('Não foi possível encontrar o equipamento solicitado.');
      clearOpenId();
    }
  }, [openedEntity, isLoadingOpenedEntity, isErrorOpenedEntity, clearOpenId]);

  const handleTabChange = (tab: string) => {
    router.push(`/dashboard/equipamentos?tab=${tab}`);
  };

  const filteredEquipamentos = useMemo(() => {
    if (!allEquipamentos) {
      return [];
    }
    let data = allEquipamentos;

    if (filters.tombamento) {
      data = data.filter(item =>
        item.tombamento.toLowerCase().includes(String(filters.tombamento).toLowerCase()),
      );
    }
    if (filters.tipoEquipamento) {
      data = data.filter(item => item.tipoEquipamento.id === filters.tipoEquipamento);
    }
    if (filters.status) {
      data = data.filter(item => String(item.status) === filters.status);
    }
    if (filters.reservavel !== undefined && filters.reservavel !== '') {
      const boolVal = filters.reservavel === 'true';
      data = data.filter(item => item.reservavel === boolVal);
    }
    return data;
  }, [allEquipamentos, filters]);

  const tiposInUse = useMemo(() => {
    if (!allEquipamentos) {
      return [];
    }
    const seen = new Map<string, TipoEquipamento>();
    allEquipamentos.forEach((equip) => {
      if (!seen.has(equip.tipoEquipamento.id)) {
        seen.set(equip.tipoEquipamento.id, equip.tipoEquipamento);
      }
    });
    return Array.from(seen.values());
  }, [allEquipamentos]);

  const pageCount = allEquipamentos
    ? Math.ceil(filteredEquipamentos.length / pagination.pageSize)
    : 0;

  return (
    <div className="h-full flex-1 flex-col space-y-4 p-4 md:p-8 md:flex">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gerenciar Equipamentos</h2>
          <p className="text-muted-foreground">
            Visualize e gerencie os equipamentos da instituição.
          </p>
        </div>
        {access.canCreateEquipamento && (
          <Button onClick={handleCreate}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Equipamento
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        {access.canManageTiposEquipamento && (
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="equipamentos">Equipamentos</TabsTrigger>
            <TabsTrigger value="tipos">Tipos de Equipamento</TabsTrigger>
          </TabsList>
        )}

        <TabsContent value="equipamentos" className="mt-4">
          <div className="space-y-4">
            <EquipamentosFilterBar
              filters={filters}
              onFilterChange={handleFilterChange}
              isFetching={isLoading}
              tiposOptions={tiposInUse}
            />
            <DataTable
              columns={equipamentoColumns}
              data={filteredEquipamentos}
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
        </TabsContent>

        {access.canManageTiposEquipamento && (
          <TabsContent value="tipos" className="mt-4">
            <ManageTiposTab />
          </TabsContent>
        )}
      </Tabs>

      {sheetState.open && (
        <MasterDetailSheet
          key={sheetState.equipamento?.id ?? 'new-equipamento'}
          open={sheetState.open}
          onOpenChange={isOpen => setSheetState(s => ({ ...s, open: isOpen }))}
          entity={sheetState.equipamento}
          entityName="Equipamento"
          initialMode={sheetMode}
          canEdit={access.canEditEquipamento}
          FormComponent={EquipamentoForm}
          MainDataViewComponent={EquipamentoMainDataView}
          RelationsViewComponent={EquipamentoRelationsView}
        />
      )}
    </div>
  );
}
