'use client';

import { useState, useMemo } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Checkbox } from '@/components/ui/checkbox';
import { useGetAllNonGenericEquipamentos } from '@/features/equipamentos/services/equipamentoService';
import { EquipamentosFilterBar } from '@/features/equipamentos/components/EquipamentosFilterBar';
import { getEquipamentoColumns } from '@/features/equipamentos/components/EquipamentoColumns';

interface TabProps {
  onSelectionChange: (ids: string[], nomes: string[]) => void;
}

export function RelatorioEquipamentosTab({ onSelectionChange }: TabProps) {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sorting, setSorting] = useState([{ id: 'tombamento', desc: false }]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);

  const { data: allEquipamentos, isLoading } = useGetAllNonGenericEquipamentos();

  const filteredData = useMemo(() => {
    if (!allEquipamentos) return [];
    return allEquipamentos.filter(item => {
      const matchTombamento = !filters.tombamento || 
        item.tombamento.toLowerCase().includes(String(filters.tombamento).toLowerCase());
      const matchTipo = !filters.tipoEquipamento || 
        item.tipoEquipamento.id === filters.tipoEquipamento;
      const matchStatus = !filters.status || 
        String(item.status) === filters.status;
      return matchTombamento && matchTipo && matchStatus;
    });
  }, [allEquipamentos, filters]);

  const tiposOptions = useMemo(() => {
    if (!allEquipamentos) return [];
    const map = new Map();
    allEquipamentos.forEach(e => map.set(e.tipoEquipamento.id, e.tipoEquipamento));
    return Array.from(map.values());
  }, [allEquipamentos]);

  const updateSelection = (ids: string[], nomes: string[]) => {
    setSelectedIds(ids);
    setSelectedNames(nomes);
    onSelectionChange(ids, nomes);
  };

  const columns = useMemo(() => {
    const baseColumns = getEquipamentoColumns({
      onView: () => {},
      onEdit: () => {},
      canView: false,
      canEdit: false,
    });

    const filteredBase = baseColumns.filter(col => col.id !== 'actions');

    const selectionColumn = {
      id: 'selection',
      header: () => (
        <Checkbox 
          checked={filteredData.length > 0 && selectedIds.length === filteredData.length}
          onCheckedChange={(checked) => {
            if (checked) {
              const ids = filteredData.map(e => e.id);
              const nomes = filteredData.map(e => e.tombamento);
              updateSelection(ids, nomes);
            } else {
              updateSelection([], []);
            }
          }}
          className="data-[state=checked]:bg-[#10B981] data-[state=checked]:border-[#10B981]"
        />
      ),
      cell: ({ row }: any) => (
        <Checkbox 
          checked={selectedIds.includes(row.original.id)}
          onCheckedChange={() => {
            const id = row.original.id;
            const nome = row.original.tombamento;
            
            let newIds, newNames;
            if (selectedIds.includes(id)) {
              newIds = selectedIds.filter(i => i !== id);
              newNames = selectedNames.filter(n => n !== nome);
            } else {
              newIds = [...selectedIds, id];
              newNames = [...selectedNames, nome];
            }
            updateSelection(newIds, newNames);
          }}
          className="data-[state=checked]:bg-[#10B981] data-[state=checked]:border-[#10B981]"
        />
      ),
      size: 40,
    };

    return [selectionColumn, ...filteredBase];
  }, [filteredData, selectedIds, selectedNames]);

  return (
    <div className="space-y-4">
      <EquipamentosFilterBar 
        filters={filters} 
        onFilterChange={(k, v) => setFilters(p => k === 'all' ? {} : ({ ...p, [k]: v }))} 
        isFetching={isLoading} 
        tiposOptions={tiposOptions} 
      />
      
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="bg-[#F1F5F9] p-3.5 border-b border-[#E2E8F0] flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#475569] uppercase tracking-wider">
            Equipamentos Selecionados para Relatório
          </span>
          <span className="text-[10px] font-extrabold text-[#10B981] uppercase bg-white px-2 py-0.5 rounded border border-[#10B981]/20">
            {selectedIds.length} SELECIONADO(S)
          </span>
        </div>
        
        <DataTable 
          columns={columns} 
          data={filteredData} 
          isLoading={isLoading}
          pageCount={Math.ceil(filteredData.length / pagination.pageSize)}
          pagination={pagination}
          onPaginationChange={setPagination}
          sorting={sorting}
          onSortingChange={setSorting}
          manualPagination={false}
          manualSorting={false}
        />
      </div>
    </div>
  );
}