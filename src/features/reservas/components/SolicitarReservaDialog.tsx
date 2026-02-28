'use client';

import type { ReservaFormValues } from '../validation/reservaSchema';
import type { ReservableResource } from '@/features/reservas/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useGetProjetos } from '@/features/projetos/services/projetoService';
import { useCreateReserva } from '../services/reservaService';
import { TipoRecorrencia } from '../types';
import { buildReservaPayload } from '../utils/buildReservaPayload';
import { buildDataFimRecorrenciaISO } from '../utils/recorrenciaUtils';
import { reservaFormSchema } from '../validation/reservaSchema';
import { RecorrenciaFields } from './RecorrenciaFields';

type Props = {
  resource: ReservableResource;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialDates?: { start: Date; end: Date };
};

const formatDateTime = (date?: Date) => {
  if (!date) {
    return '';
  }
  return date.toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' });
};

/** Detects conflict error messages returned by the backend. */
function isConflictError(err: unknown): boolean {
  const message = (err as any)?.response?.data?.message ?? (err as Error)?.message ?? '';
  return /conflict|conflito|ocupado|overlap/i.test(message);
}

export function SolicitarReservaDialog({ resource, open, onOpenChange, initialDates }: Props) {
  const { user } = useAuthStore();

  const { data: projetosData, isLoading: isLoadingProjetos } = useGetProjetos({
    usuarioResponsavelId: user?.id,
    size: 1000,
  });

  const createMutation = useCreateReserva();

  const form = useForm<ReservaFormValues>({
    resolver: zodResolver(reservaFormSchema),
    defaultValues: {
      dataInicio: initialDates?.start,
      dataFim: initialDates?.end,
      tipoRecorrencia: TipoRecorrencia.NAO_REPETE,
    },
  });

  const isReadyForSubmission = !!initialDates && !!user && !!resource;

  useEffect(() => {
    if (open && initialDates) {
      form.reset({
        dataInicio: initialDates.start,
        dataFim: initialDates.end,
        projetoId: '',
        tipoRecorrencia: TipoRecorrencia.NAO_REPETE,
        dataFimRecorrencia: undefined,
      });
    }
  }, [open, initialDates, form]);

  const onValidationErrors = () => {
    toast.error('Por favor, verifique os campos do formulário.');
  };

  const onSubmit = async (values: ReservaFormValues) => {
    if (!isReadyForSubmission || !user?.id) {
      toast.error('Não foi possível processar a solicitação. Verifique os dados.');
      return;
    }

    if (resource.requiresProject && !values.projetoId) {
      form.setError('projetoId', { message: 'Este recurso exige um projeto.' });
      return;
    }

    const isRecorrente = values.tipoRecorrencia !== TipoRecorrencia.NAO_REPETE;

    const basePayload = {
      dataInicio: values.dataInicio.toISOString(),
      dataFim: values.dataFim.toISOString(),
      projetoId: values.projetoId,
      usuarioSolicitanteId: user.id,
      status: 0 as const,
      tipoRecorrencia: values.tipoRecorrencia,
      ...(isRecorrente && values.dataFimRecorrencia && {
        dataFimRecorrencia: buildDataFimRecorrenciaISO(values.dataFimRecorrencia, values.dataFim),
      }),
    };

    const payload = buildReservaPayload(resource, basePayload);

    toast.promise(createMutation.mutateAsync(payload), {
      loading: isRecorrente ? 'Criando reservas recorrentes...' : 'Enviando solicitação...',
      success: () => {
        onOpenChange(false);
        form.reset();
        return isRecorrente
          ? 'Reservas recorrentes criadas com sucesso!'
          : 'Solicitação de reserva enviada com sucesso!';
      },
      error: (err) => {
        if (isConflictError(err)) {
          return 'Uma ou mais ocorrências conflitam com reservas existentes. Nenhuma reserva foi criada.';
        }
        return 'Falha ao enviar solicitação.';
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmar Solicitação de Reserva</DialogTitle>
          <DialogDescription>
            Confirme os detalhes da sua solicitação para
            {' '}
            <span className="font-semibold">{resource.displayName}</span>
            .
          </DialogDescription>
        </DialogHeader>

        {/* Selected period — read-only summary */}
        <div className="space-y-2 rounded-md border p-4">
          {initialDates
            ? (
                <>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Início</p>
                    <p className="text-sm text-gray-600">{formatDateTime(initialDates.start)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Fim</p>
                    <p className="text-sm text-gray-600">{formatDateTime(initialDates.end)}</p>
                  </div>
                </>
              )
            : (
                <p className="text-sm font-medium text-destructive">
                  Datas não selecionadas. Por favor, selecione um período no calendário.
                </p>
              )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onValidationErrors)} className="space-y-4">
            <Separator />

            <RecorrenciaFields control={form.control} />

            <Separator />

            {resource.requiresProject && (
              <FormField
                control={form.control}
                name="projetoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Projeto Vinculado (Obrigatório)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoadingProjetos}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione seu projeto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projetosData?.content?.map(proj => (
                          <SelectItem key={proj.id} value={proj.id}>
                            {proj.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || !isReadyForSubmission}
              >
                {createMutation.isPending ? 'Enviando...' : 'Confirmar Solicitação'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
