'use client';

import { DebouncedInput } from '@/components/ui/debounced-input';
import { FilterBarContainer } from '@/components/ui/filter-bar-container';

type EquipamentosGenericosFilterBarProps = {
  filters: Record<string, any>;
  onFilterChange: (key: string, value: any) => void;
  isFetching: boolean;
};

export function EquipamentosGenericosFilterBar({
  filters,
  onFilterChange,
  isFetching,
}: EquipamentosGenericosFilterBarProps) {
  const handleClear = () => onFilterChange('all', null);

  return (
    <FilterBarContainer
      activeFilters={filters}
      onClear={handleClear}
      isFetching={isFetching}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DebouncedInput
          placeholder="Buscar por nome..."
          value={filters.nome || ''}
          onDebouncedChange={value => onFilterChange('nome', value)}
          disabled={isFetching}
        />
      </div>
    </FilterBarContainer>
  );
}
