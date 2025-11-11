'use client';

import { DebouncedInput } from '@/components/ui/debounced-input';
import { FilterBarContainer } from '@/components/ui/filter-bar-container';

type ComplexosFilterBarProps = {
  filters: Record<string, any>;
  onFilterChange: (key: string, value: any) => void;
  isFetching: boolean;
};

export function ComplexosFilterBar({ filters, onFilterChange, isFetching }: ComplexosFilterBarProps) {
  const handleClear = () => {
    onFilterChange('all', null);
  };

  return (
    <FilterBarContainer activeFilters={filters} onClear={handleClear} isFetching={isFetching}>
      <div className="w-full sm:max-w-xs">
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
