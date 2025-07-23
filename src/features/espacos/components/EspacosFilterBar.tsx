'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  const handleClearFilters = () => {
    onFilterChange('all', null);
  };
  const hasActiveFilters = Object.values(filters).some(Boolean);
  return (
    <div className="p-4 border rounded-lg space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select
          onValueChange={value => onFilterChange('departamento', value)}
          value={filters.departamento || ''}
          disabled={isFetching}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por Departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {departamentos?.map(dep => (
              <SelectItem key={dep.id} value={dep.id}>{dep.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={value => onFilterChange('localizacao', value)}
          value={filters.localizacao || ''}
          disabled={isFetching}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por Localização" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {localizacoes?.map(loc => (
              <SelectItem key={loc.id} value={loc.id}>{loc.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={value => onFilterChange('tipoEspaco', value)}
          value={filters.tipoEspaco || ''}
          disabled={isFetching}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por Tipo de Espaço" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {tiposEspaco?.map(tipo => (
              <SelectItem key={tipo.id} value={tipo.id}>{tipo.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={value => onFilterChange('tipoAtividade', value)}
          value={filters.tipoAtividade || ''}
          disabled={isFetching}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por Tipo de Atividade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {tiposAtividade?.map(tipo => (
              <SelectItem key={tipo.id} value={tipo.id}>{tipo.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {hasActiveFilters && (
        <Button variant="ghost" onClick={handleClearFilters} className="text-sm text-muted-foreground">
          <X className="mr-2 h-4 w-4" />
          Limpar Filtros
        </Button>
      )}
    </div>
  );
}
