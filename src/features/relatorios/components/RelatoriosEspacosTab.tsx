'use client';

import { useState, useMemo } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Checkbox } from '@/components/ui/checkbox';
import { useGetEspacos } from '@/features/espacos/services/espacoService';
import { EspacosFilterBar } from '@/features/espacos/components/EspacosFilterBar';
import { getColumns } from '@/features/espacos/components/EspacosColumns'; 

interface TabProps {
  onSelectionChange: (ids: string[], nomes: string[]) => void;
}

export function RelatorioEspacosTab({ onSelectionChange }: TabProps) {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sorting, setSorting] = useState([{ id: 'nome', desc: false }]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);

  const { data, isLoading, isFetching } = useGetEspacos({
    page: pagination.pageIndex,
    size: pagination.pageSize,
    sortField: sorting[0]?.id ?? 'nome',
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
    ...filters,
  });

  const updateSelection = (ids: string[], nomes: string[]) => {
    setSelectedIds(ids);
    setSelectedNames(nomes);
    onSelectionChange(ids, nomes);
  };

  const columns = useMemo(() => {
    const baseColumns = getColumns({
      onView: () => {}, 
      onEdit: () => {},
      canEdit: () => false,
    });

    const filteredBase = baseColumns.filter(col => col.id !== 'actions');

    const selectionColumn = {
      id: 'selection',
      header: () => (
        <Checkbox 
          checked={data?.content?.length ? selectedIds.length === data.content.length : false}
          onCheckedChange={(checked) => {
            if (checked && data?.content) {
              const ids = data.content.map(i => i.id);
              const nomes = data.content.map(i => i.nome);
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
            const nome = row.original.nome;
            
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
  }, [data, selectedIds, selectedNames]);

  return (
    <div className="space-y-4">
      <EspacosFilterBar 
        filters={filters} 
        onFilterChange={(k, v) => setFilters(p => k === 'all' ? {} : {...p, [k]: v})} 
        isFetching={isLoading || isFetching} 
      />
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden text-black">
        <div className="bg-[#F1F5F9] p-3.5 border-b border-[#E2E8F0] flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#475569] uppercase tracking-wider">
              Espaços Selecionados para Relatório
            </span>
            <span className="text-[10px] font-extrabold text-[#10B981] uppercase bg-white px-2 py-0.5 rounded border border-[#10B981]/20">
              {selectedIds.length} SELECIONADO(S)
            </span>
          </div>
        <DataTable 
          columns={columns} 
          data={data?.content ?? []} 
          pageCount={data?.totalPages ?? 0}
          pagination={pagination}
          onPaginationChange={setPagination}
          sorting={sorting}
          onSortingChange={setSorting}
          isLoading={isLoading || isFetching}
        />
      </div>
    </div>
  );
}