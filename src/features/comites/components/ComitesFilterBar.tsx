'use client';

import { FilterBarContainer } from '@/components/ui/filter-bar-container';
import { FilterSelect } from '@/components/ui/filter-select';
import { ComiteTipoMap } from '../types';

type ComitesFilterBarProps = {
  filters: Record<string, any>;
  onFilterChange: (key: string, value: any) => void;
  isFetching: boolean;
};

const tipoOptions = Object.entries(ComiteTipoMap).map(([value, label]) => ({
  id: value,
  nome: label,
}));

export function ComitesFilterBar({ filters, onFilterChange, isFetching }: ComitesFilterBarProps) {
  const handleClear = () => onFilterChange('all', null);

  return (
    <FilterBarContainer activeFilters={filters} onClear={handleClear} isFetching={isFetching}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <FilterSelect
          placeholder="Filtrar por Tipo"
          options={tipoOptions}
          value={filters.tipo || ''}
          onValueChange={value => onFilterChange('tipo', value)}
          disabled={isFetching}
          allOptionLabel="Todos os Tipos"
        />
      </div>
    </FilterBarContainer>
  );
}
