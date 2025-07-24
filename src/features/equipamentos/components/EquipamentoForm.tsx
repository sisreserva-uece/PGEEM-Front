'use client';

import type { Equipamento } from '../types';
import type { EquipamentoFormValues } from '../validation/equipamentoSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateEquipamento, useGetTiposEquipamento, useUpdateEquipamento } from '../services/equipamentoService';
import { EquipamentoStatus } from '../types';
import { equipamentoSchema } from '../validation/equipamentoSchema';

type EquipamentoFormProps = {
  entity?: Equipamento | null;
  onSuccess: () => void;
};

export function EquipamentoForm({ entity: equipamento, onSuccess }: EquipamentoFormProps) {
  const isEditMode = !!equipamento;
  const { data: tiposData } = useGetTiposEquipamento({ todos: true });

  const form = useForm<EquipamentoFormValues>({
    resolver: zodResolver(equipamentoSchema),
    defaultValues: isEditMode
      ? {
          tombamento: equipamento.tombamento,
          descricao: equipamento.descricao || '',
          status: equipamento.status,
          tipoEquipamentoId: equipamento.tipoEquipamento.id,
        }
      : { tombamento: '', descricao: '', status: EquipamentoStatus.ATIVO, tipoEquipamentoId: '' },
  });

  const createMutation = useCreateEquipamento();
  const updateMutation = useUpdateEquipamento();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (values: EquipamentoFormValues) => {
    const promise = isEditMode
      ? updateMutation.mutateAsync({ id: equipamento.id, ...values })
      : createMutation.mutateAsync(values);

    toast.promise(promise, {
      loading: `${isEditMode ? 'Atualizando' : 'Criando'} equipamento...`,
      success: () => {
        onSuccess();
        return `Equipamento ${isEditMode ? 'atualizado' : 'criado'} com sucesso!`;
      },
      error: err => `Erro ao salvar equipamento: ${err.message}`,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="tombamento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tombamento</FormLabel>
                <FormControl><Input placeholder="Ex: 123456-ABC" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tipoEquipamentoId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Equipamento</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Selecione um tipo" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {tiposData?.content?.map(tipo => (
                      <SelectItem key={tipo.id} value={tipo.id}>{tipo.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="sm:col-span-2">
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (Opcional)</FormLabel>
                  <FormControl><Textarea placeholder="Qualquer detalhe relevante sobre o item..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={val => field.onChange(Number(val))} defaultValue={String(field.value)}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Selecione um status" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value={String(EquipamentoStatus.ATIVO)}>Ativo</SelectItem>
                    <SelectItem value={String(EquipamentoStatus.INATIVO)}>Inativo</SelectItem>
                    <SelectItem value={String(EquipamentoStatus.EM_MANUTENCAO)}>Em Manutenção</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
