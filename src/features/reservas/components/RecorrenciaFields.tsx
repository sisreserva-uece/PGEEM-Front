'use client';

import type { Control } from 'react-hook-form';
import type { ReservaFormValues } from '../validation/reservaSchema';
import { Info } from 'lucide-react';
import { useWatch } from 'react-hook-form';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TipoRecorrencia, TipoRecorrenciaMap } from '../types';
import {
  buildRecorrenciaSummary,
  getWeekdayName,
} from '../utils/recorrenciaUtils';

const RECORRENCIA_OPTIONS = [
  TipoRecorrencia.NAO_REPETE,
  TipoRecorrencia.DIARIA,
  TipoRecorrencia.SEMANAL,
  TipoRecorrencia.MENSAL,
] as const;

type Props = {
  control: Control<ReservaFormValues>;
};

export function RecorrenciaFields({ control }: Props) {
  const [tipoRecorrencia, dataInicio, dataFimRecorrencia] = useWatch({
    control,
    name: ['tipoRecorrencia', 'dataInicio', 'dataFimRecorrencia'],
  });

  const tipo = tipoRecorrencia ?? TipoRecorrencia.NAO_REPETE;
  const isRecorrente = tipo !== TipoRecorrencia.NAO_REPETE;

  const summary = buildRecorrenciaSummary(dataInicio, dataFimRecorrencia, tipo);

  return (
    <div className="space-y-3">
      <FormField
        control={control}
        name="tipoRecorrencia"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Recorrência</FormLabel>
            <Select
              onValueChange={val => field.onChange(Number(val) as TipoRecorrencia)}
              value={String(field.value ?? TipoRecorrencia.NAO_REPETE)}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a recorrência" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {RECORRENCIA_OPTIONS.map(opt => (
                  <SelectItem key={opt} value={String(opt)}>
                    {TipoRecorrenciaMap[opt]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {isRecorrente && (
        <>
          {tipo === TipoRecorrencia.SEMANAL && dataInicio && (
            <p className="text-sm text-muted-foreground">
              Repete toda
              {' '}
              <span className="font-medium text-foreground">{getWeekdayName(dataInicio)}</span>
              {' '}
              (dia da semana fixado pela data de início)
            </p>
          )}

          <FormField
            control={control}
            name="dataFimRecorrencia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repetir até</FormLabel>
                <FormControl>
                  <DateTimePicker
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {summary && (
            <div className="flex items-start gap-2 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{summary}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
