'use client';

import type { TipoEspaco } from '../types';
import type { TipoEspacoCreatePayload } from '../validation/espacoSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCreateTipoEspaco, useUpdateTipoEspaco } from '../services/espacoService';
import { tipoEspacoFormSchema } from '../validation/espacoSchema';

type Props = {
  entity?: TipoEspaco | null;
  onSuccess: () => void;
};

export function TipoEspacoForm({ entity: tipo, onSuccess }: Props) {
  const isEditMode = !!tipo;

  const form = useForm<TipoEspacoCreatePayload>({
    resolver: zodResolver(tipoEspacoFormSchema),
    defaultValues: {
      nome: '',
    },
  });

  useEffect(() => {
    if (tipo) {
      form.reset({ nome: tipo.nome });
    } else {
      form.reset({ nome: '' });
    }
  }, [tipo, form]);

  const createMutation = useCreateTipoEspaco();
  const updateMutation = useUpdateTipoEspaco();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (values: TipoEspacoCreatePayload) => {
    const promise = isEditMode
      ? updateMutation.mutateAsync({ id: tipo.id, ...values })
      : createMutation.mutateAsync(values);

    toast.promise(promise, {
      loading: `${isEditMode ? 'Atualizando' : 'Criando'} tipo de espaço...`,
      success: () => {
        onSuccess();
        return `Tipo de espaço ${isEditMode ? 'atualizado' : 'criado'} com sucesso!`;
      },
      error: err => `Erro ao salvar: ${err.message}`,
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
                <Input placeholder="Ex: Laboratório de Pesquisa" {...field} />
              </FormControl>
              <FormMessage />
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
