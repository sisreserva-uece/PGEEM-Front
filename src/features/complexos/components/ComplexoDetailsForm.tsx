'use client';

import type { Complexo } from '../types';
import type { ComplexoCreatePayload } from '../validation/complexoSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateComplexo, useUpdateComplexo } from '../services/complexoService';
import { complexoFormSchema } from '../validation/complexoSchema';

type ComplexoFormProps = {
  entity?: Complexo | null;
  onSuccess: () => void;
};

export function ComplexoDetailsForm({ entity: complexo, onSuccess }: ComplexoFormProps) {
  const isEditMode = !!complexo;

  const form = useForm<ComplexoCreatePayload>({
    resolver: zodResolver(complexoFormSchema),
    defaultValues: isEditMode
      ? {
          nome: complexo.nome,
          descricao: complexo.descricao || '',
          site: complexo.site || '',
        }
      : { nome: '', descricao: '', site: '' },
  });

  const createMutation = useCreateComplexo();
  const updateMutation = useUpdateComplexo();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (values: ComplexoCreatePayload) => {
    const promise = isEditMode
      ? updateMutation.mutateAsync({ id: complexo.id, ...values })
      : createMutation.mutateAsync(values);

    toast.promise(promise, {
      loading: `${isEditMode ? 'Atualizando' : 'Criando'} complexo...`,
      success: () => {
        onSuccess();
        return `Complexo ${isEditMode ? 'atualizado' : 'criado'} com sucesso!`;
      },
      error: err => `Erro ao salvar complexo: ${err.message}`,
    });
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
                <Input placeholder="Ex: Complexo de Laboratórios Integrados" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="site"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="https://exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição (Opcional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Descreva o propósito do complexo..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
