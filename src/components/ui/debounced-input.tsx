'use client';

import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/lib/hooks/useDebounce';

type DebouncedInputProps = {
  value: string;
  onDebouncedChange: (value: string) => void;
  debounceTimeout?: number;
} & Omit<React.ComponentProps<typeof Input>, 'onChange' | 'value'>;

export function DebouncedInput({
  value: initialValue,
  onDebouncedChange,
  debounceTimeout = 500,
  ...props
}: DebouncedInputProps) {
  const [value, setValue] = useState(initialValue || '');
  const debouncedValue = useDebounce(value, debounceTimeout);

  useEffect(() => {
    onDebouncedChange(debouncedValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  useEffect(() => {
    if (initialValue === '') {
      setValue('');
    }
  }, [initialValue]);

  return (
    <Input
      {...props}
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  );
}
