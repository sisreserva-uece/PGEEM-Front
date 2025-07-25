'use client';

import type { TipoEquipamento } from '../types';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { FilterBarContainer } from '@/components/ui/filter-bar-container';
import { FilterSelect } from '@/components/ui/filter-select';
import { EquipamentoStatus } from '../types';

type EquipamentosFilterBarProps = {
  filters: Record<string, any>;
  onFilterChange: (key: string, value: any) => void;
  isFetching: boolean;
  tiposOptions: TipoEquipamento[];
};

const statusOptions = [
  { id: String(EquipamentoStatus.ATIVO), nome: 'Ativo' },
  { id: String(EquipamentoStatus.INATIVO), nome: 'Inativo' },
  { id: String(EquipamentoStatus.EM_MANUTENCAO), nome: 'Em Manutenção' },
];

export function EquipamentosFilterBar({ filters, onFilterChange, isFetching, tiposOptions }: EquipamentosFilterBarProps) {
  const handleClear = () => {
    onFilterChange('all', null);
  };

  return (
    <FilterBarContainer activeFilters={filters} onClear={handleClear} isFetching={isFetching}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <DebouncedInput
          placeholder="Buscar por tombamento..."
          value={filters.tombamento}
          onDebouncedChange={value => onFilterChange('tombamento', value)}
          disabled={isFetching}
        />
        <FilterSelect
          placeholder="Filtrar por Tipo"
          options={tiposOptions}
          value={filters.tipoEquipamento || ''}
          onValueChange={value => onFilterChange('tipoEquipamento', value)}
          disabled={isFetching}
          allOptionLabel="Todos os Tipos"
        />
        <FilterSelect
          placeholder="Filtrar por Status"
          options={statusOptions}
          value={filters.status || ''}
          onValueChange={value => onFilterChange('status', value)}
          disabled={isFetching}
          allOptionLabel="Todos os Status"
        />
      </div>
    </FilterBarContainer>
  );
}
