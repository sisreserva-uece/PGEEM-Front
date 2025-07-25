'use client';

import type { ReservaCreatePayload, ReservaFormValues } from '../validation/reservaSchema';
import type { Espaco } from '@/features/espacos/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DateTimePicker } from '@/components/ui/date-time-picker';
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
};

export function SolicitarReservaDialog({ espaco, open, onOpenChange }: Props) {
  const { user } = useAuthStore();
  const { data: projetosData, isLoading: isLoadingProjetos } = useGetProjetos({
    usuarioResponsavelId: user?.id,
    size: 1000,
  });
  const createMutation = useCreateReserva();
  const form = useForm<ReservaFormValues>({
    resolver: zodResolver(reservaFormSchema),
    defaultValues: {
      dataInicio: new Date(),
    },
  });

  const onSubmit = (values: ReservaFormValues) => {
    if (!user || !espaco) {
      return;
    }
    if (espaco.precisaProjeto && !values.projetoId) {
      form.setError('projetoId', { message: 'Este espaço exige um projeto.' });
      return;
    }
    const payload: ReservaCreatePayload = {
      ...values,
      dataInicio: values.dataInicio.toISOString(),
      dataFim: values.dataFim.toISOString(),
      espacoId: espaco.id,
      usuarioSolicitanteId: user.id,
      status: ReservaStatus.PENDENTE,
      projetoId: values.projetoId || undefined,
    };

    toast.promise(createMutation.mutateAsync(payload), {
      loading: 'Enviando solicitação...',
      success: () => {
        onOpenChange(false);
        form.reset();
        return 'Solicitação de reserva enviada com sucesso!';
      },
      error: 'Falha ao enviar solicitação.',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Solicitar Reserva para:
            {' '}
            {espaco.nome}
          </DialogTitle>
          <DialogDescription>Preencha as datas e horários desejados.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dataInicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Início da Reserva</FormLabel>
                    <DateTimePicker mode="datetime" value={field.value} onChange={field.onChange} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dataFim"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fim da Reserva</FormLabel>
                    <DateTimePicker mode="datetime" value={field.value} onChange={field.onChange} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Enviando...' : 'Confirmar Solicitação'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
