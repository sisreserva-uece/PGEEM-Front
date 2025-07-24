'use client';

import type { ApiSelectOption } from '@/types/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type FilterSelectProps = {
  placeholder: string;
  options: ApiSelectOption[] | undefined;
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  showAllOption?: boolean;
  allOptionLabel?: string;
};

export function FilterSelect({
  placeholder,
  options,
  value,
  onValueChange,
  disabled = false,
  showAllOption = true,
  allOptionLabel = 'Todos',
}: FilterSelectProps) {
  return (
    <Select onValueChange={onValueChange} value={value} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {showAllOption && <SelectItem value="all">{allOptionLabel}</SelectItem>}
        {options?.map(option => (
          <SelectItem key={option.id} value={option.id}>
            {option.nome}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
