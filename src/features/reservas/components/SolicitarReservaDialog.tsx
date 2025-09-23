'use client';

import type { ReservaCreatePayload, ReservaFormValues } from '../validation/reservaSchema';
import type { Espaco } from '@/features/espacos/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useGetProjetos } from '@/features/projetos/services/projetoService';
import { useCreateReserva } from '../services/reservaService';
import { ReservaStatus } from '../types';
import { reservaFormSchema } from '../validation/reservaSchema';

type Props = {
  espaco: Espaco;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialDates?: { start: Date; end: Date };
};

const formatDateTime = (date?: Date) => {
  if (!date) {
    return '';
  }
  return date.toLocaleString('pt-BR', {
    dateStyle: 'full',
    timeStyle: 'short',
  });
};

export function SolicitarReservaDialog({ espaco, open, onOpenChange, initialDates }: Props) {
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
    },
  });

  const isReadyForSubmission = !!initialDates && !!user && !!espaco;

  useEffect(() => {
    if (open && initialDates) {
      form.reset({
        dataInicio: initialDates.start,
        dataFim: initialDates.end,
        projetoId: '',
      });
    }
  }, [open, initialDates, form]);

  const onValidationErrors = (errors: any) => {
    toast.error('Por favor, verifique os campos do formulário.');
  };

  const onSubmit = (values: ReservaFormValues) => {
    if (!isReadyForSubmission) {
      toast.error('Não foi possível processar a solicitação. As datas da reserva não foram definidas.');
      return;
    }
    if (espaco.precisaProjeto && !values.projetoId) {
      form.setError('projetoId', { message: 'Este espaço exige um projeto.' });
      return;
    }
    const payload: ReservaCreatePayload = {
      ...values,
      espacoId: espaco.id,
      usuarioSolicitanteId: user.id,
      status: ReservaStatus.PENDENTE,
      dataInicio: initialDates.start.toISOString(),
      dataFim: initialDates.end.toISOString(),
      projetoId: values.projetoId || undefined,
    };
    toast.promise(createMutation.mutateAsync(payload), {
      loading: 'Enviando solicitação...',
      success: () => {
        onOpenChange(false);
        form.reset();
        return 'Solicitação de reserva enviada com sucesso!';
      },
      error: (err) => {
        return 'Falha ao enviar solicitação.';
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Solicitação de Reserva</DialogTitle>
          <DialogDescription>
            Confirme os detalhes da sua solicitação para
            {' '}
            <span className="font-semibold">{espaco.nome}</span>
            .
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 rounded-md border p-4">
          {initialDates
            ? (
                <>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Início da Reserva</p>
                    <p className="text-sm text-gray-600">{formatDateTime(initialDates?.start)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Fim da Reserva</p>
                    <p className="text-sm text-gray-600">{formatDateTime(initialDates?.end)}</p>
                  </div>
                </>
              )
            : (
                <p className="text-sm font-medium text-destructive">
                  Datas não selecionadas. Por favor, selecione um período no calendário para continuar.
                </p>
              )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onValidationErrors)} className="space-y-4">
            {espaco.precisaProjeto && (
              <FormField
                control={form.control}
                name="projetoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Projeto Vinculado (Obrigatório)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingProjetos}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione seu projeto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projetosData?.content?.map(proj => (
                          <SelectItem key={proj.id} value={proj.id}>{proj.nome}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit" disabled={createMutation.isPending || !isReadyForSubmission}>
                {createMutation.isPending ? 'Enviando...' : 'Confirmar Solicitação'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
