'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

type FilterBarContainerProps = {
  children: React.ReactNode;
  activeFilters: Record<string, any>;
  onClear: () => void;
  isFetching?: boolean;
};

export function FilterBarContainer({ children, activeFilters, onClear, isFetching }: FilterBarContainerProps) {
  const hasActiveFilters = Object.values(activeFilters).some(Boolean);
  return (
    <div className="p-4 border rounded-lg space-y-4">
      {children}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          onClick={onClear}
          disabled={isFetching}
          className="text-sm text-muted-foreground h-auto p-1"
        >
          <X className="mr-2 h-4 w-4" />
          Limpar Filtros
        </Button>
      )}
    </div>
  );
}
