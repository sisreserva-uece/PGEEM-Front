'use client';

import type { ApiSelectOption } from '@/types/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ALL_SENTINEL = '__all__';

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
  const internalValue = value || ALL_SENTINEL;

  const handleValueChange = (selected: string) => {
    onValueChange(selected === ALL_SENTINEL ? '' : selected);
  };

  return (
    <Select onValueChange={handleValueChange} value={internalValue} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {showAllOption && (
          <SelectItem value={ALL_SENTINEL}>{allOptionLabel}</SelectItem>
        )}
        {options?.map(option => (
          <SelectItem key={option.id} value={option.id}>
            {option.nome}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
