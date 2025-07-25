'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type DateTimePickerProps = {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  mode?: 'date' | 'datetime';
  disabled?: (date: Date) => boolean;
  className?: string;
};

export function DateTimePicker({
  value,
  onChange,
  mode = 'date',
  disabled,
  className,
}: DateTimePickerProps) {
  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate) {
      onChange(undefined);
      return;
    }
    // If a date is selected, preserve the existing time part from the original value
    const updatedDate = new Date(newDate);
    if (value) {
      updatedDate.setHours(value.getHours());
      updatedDate.setMinutes(value.getMinutes());
      updatedDate.setSeconds(value.getSeconds());
    }
    onChange(updatedDate);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value;
    const [hours, minutes] = timeValue.split(':').map(Number);

    // Start with the current date value, or now if it's not set
    const updatedDate = value ? new Date(value) : new Date();
    updatedDate.setHours(hours);
    updatedDate.setMinutes(minutes);
    updatedDate.setSeconds(0); // Reset seconds for consistency
    onChange(updatedDate);
  };

  const formatString = mode === 'datetime' ? 'PPP \'às\' p' : 'PPP';
  const timeValue = value ? format(value, 'HH:mm') : '';

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!value}
          className={cn(
            'w-full justify-start text-left font-normal',
            'data-[empty=true]:text-muted-foreground',
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, formatString) : <span>Selecione uma data</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleDateSelect}
          disabled={disabled}
        />
        {mode === 'datetime' && (
          <div className="p-3 border-t border-border">
            <Input
              type="time"
              value={timeValue}
              onChange={handleTimeChange}
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
