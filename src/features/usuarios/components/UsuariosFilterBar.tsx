'use client';

import { DebouncedInput } from '@/components/ui/debounced-input';
import { FilterBarContainer } from '@/components/ui/filter-bar-container';

type Props = {
  filters: Record<string, any>;
  onFilterChange: (key: string, value: any) => void;
  isFetching: boolean;
};

export function UsuariosFilterBar({ filters, onFilterChange, isFetching }: Props) {
  const handleClear = () => onFilterChange('all', null);

  return (
    <FilterBarContainer activeFilters={filters} onClear={handleClear} isFetching={isFetching}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <DebouncedInput
          placeholder="Buscar por nome..."
          value={filters.nome || ''}
          onDebouncedChange={value => onFilterChange('nome', value)}
          disabled={isFetching}
        />
        <DebouncedInput
          placeholder="Buscar por email..."
          value={filters.email || ''}
          onDebouncedChange={value => onFilterChange('email', value)}
          disabled={isFetching}
        />
        <DebouncedInput
          placeholder="Buscar por matrícula..."
          value={filters.matricula || ''}
          onDebouncedChange={value => onFilterChange('matricula', value)}
          disabled={isFetching}
        />
      </div>
    </FilterBarContainer>
  );
}
