'use client';

import { DebouncedInput } from '@/components/ui/debounced-input';
import { FilterBarContainer } from '@/components/ui/filter-bar-container';
import { FilterSelect } from '@/components/ui/filter-select'; // <-- Import the new component
import { useGetSelectOptions } from '../services/espacoService';

type EspacosFilterBarProps = {
  filters: Record<string, any>;
  onFilterChange: (key: string, value: any) => void;
  isFetching: boolean;
};

export function EspacosFilterBar({ filters, onFilterChange, isFetching }: EspacosFilterBarProps) {
  const { data: departamentos } = useGetSelectOptions('/departamento', 'departamentos');
  const { data: localizacoes } = useGetSelectOptions('/localizacao', 'localizacoes');
  const { data: tiposEspaco } = useGetSelectOptions('/espaco/tipo', 'tiposEspaco');
  const { data: tiposAtividade } = useGetSelectOptions('/atividade/tipo', 'tiposAtividade');

  const handleClear = () => {
    onFilterChange('all', null);
  };

  return (
    <FilterBarContainer activeFilters={filters} onClear={handleClear} isFetching={isFetching}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <DebouncedInput
          placeholder="Buscar por nome..."
          value={filters.nome || ''}
          onDebouncedChange={value => onFilterChange('nome', value)}
          disabled={isFetching}
        />
        <FilterSelect
          placeholder="Filtrar por Departamento"
          options={departamentos}
          value={filters.departamento || ''}
          onValueChange={value => onFilterChange('departamento', value)}
          disabled={isFetching}
          allOptionLabel="Todos"
        />
        <FilterSelect
          placeholder="Filtrar por Localização"
          options={localizacoes}
          value={filters.localizacao || ''}
          onValueChange={value => onFilterChange('localizacao', value)}
          disabled={isFetching}
          allOptionLabel="Todos"
        />
        <FilterSelect
          placeholder="Filtrar por Tipo de Espaço"
          options={tiposEspaco}
          value={filters.tipoEspaco || ''}
          onValueChange={value => onFilterChange('tipoEspaco', value)}
          disabled={isFetching}
          allOptionLabel="Todos"
        />
        <FilterSelect
          placeholder="Filtrar por Tipo de Atividade"
          options={tiposAtividade}
          value={filters.tipoAtividade || ''}
          onValueChange={value => onFilterChange('tipoAtividade', value)}
          disabled={isFetching}
          allOptionLabel="Todos"
        />
      </div>
    </FilterBarContainer>
  );
}
