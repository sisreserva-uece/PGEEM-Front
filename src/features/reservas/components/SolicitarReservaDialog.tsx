'use client';

import type { ReservaFormValues } from '../validation/reservaSchema';
import type { ReservableResource } from '@/features/reservas/types';
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
import { buildReservaPayload } from '@/features/reservas/utils/buildReservaPayload';
import { useCreateReserva } from '../services/reservaService';
import { reservaFormSchema } from '../validation/reservaSchema';

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
  return date.toLocaleString('pt-BR', {
    dateStyle: 'full',
    timeStyle: 'short',
  });
};

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
    },
  });

  const isReadyForSubmission = !!initialDates && !!user && !!resource;

  useEffect(() => {
    if (open && initialDates) {
      form.reset({
        dataInicio: initialDates.start,
        dataFim: initialDates.end,
        projetoId: '',
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

    const basePayload = {
      dataInicio: values.dataInicio.toISOString(),
      dataFim: values.dataFim.toISOString(),
      projetoId: values.projetoId,
      usuarioSolicitanteId: user.id,
      status: 0 as const,
    };

    const payload = buildReservaPayload(resource, basePayload);

    toast.promise(createMutation.mutateAsync(payload), {
      loading: 'Enviando solicitação...',
      success: () => {
        onOpenChange(false);
        form.reset();
        return 'Solicitação de reserva enviada com sucesso!';
      },
      error: () => 'Falha ao enviar solicitação.',
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
            <span className="font-semibold">{resource.displayName}</span>
            .
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
            {resource.requiresProject && (
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
