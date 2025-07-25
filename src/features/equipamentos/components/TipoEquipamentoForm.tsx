'use client';

import type { TipoEquipamento } from '../types';
import type { TipoEquipamentoCreatePayload } from '../validation/equipamentoSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCreateTipoEquipamento, useUpdateTipoEquipamento } from '../services/equipamentoService';
import { tipoEquipamentoFormSchema } from '../validation/equipamentoSchema';

type Props = {
  entity?: TipoEquipamento | null;
  onSuccess: () => void;
};

export function TipoEquipamentoForm({ entity: tipo, onSuccess }: Props) {
  const isEditMode = !!tipo;

  const form = useForm<TipoEquipamentoCreatePayload>({
    resolver: zodResolver(tipoEquipamentoFormSchema),
    defaultValues: {
      nome: '',
      isDetalhamentoObrigatorio: false,
    },
  });

  useEffect(() => {
    if (tipo) {
      form.reset({
        nome: tipo.nome,
        isDetalhamentoObrigatorio: tipo.isDetalhamentoObrigatorio,
      });
    } else {
      form.reset({
        nome: '',
        isDetalhamentoObrigatorio: false,
      });
    }
  }, [tipo, form]);

  const createMutation = useCreateTipoEquipamento();
  const updateMutation = useUpdateTipoEquipamento();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const handleSuccess = () => {
    toast.success(`Tipo de equipamento ${isEditMode ? 'atualizado' : 'criado'} com sucesso!`);
    onSuccess();
  };

  const onSubmit = (values: TipoEquipamentoCreatePayload) => {
    if (isEditMode) {
      const updatePayload = { nome: values.nome };
      updateMutation.mutate({ id: tipo.id, ...updatePayload }, {
        onSuccess: handleSuccess,
      });
    } else {
      createMutation.mutate(values, {
        onSuccess: handleSuccess,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Cadeira de Escritório" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isDetalhamentoObrigatorio"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isEditMode}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Detalhamento Obrigatório</FormLabel>
                <p className="text-xs text-muted-foreground">
                  {isEditMode
                    ? 'Este campo não pode ser alterado após a criação.'
                    : 'Exige que cada item deste tipo seja cadastrado individualmente.'}
                </p>
              </div>
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4 gap-2">
          <Button type="button" variant="ghost" onClick={onSuccess}>Cancelar</Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
