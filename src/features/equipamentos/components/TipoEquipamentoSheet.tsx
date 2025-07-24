'use client';

import type { TipoEquipamento } from '../types';
import type { TipoEquipamentoFormValues } from '../validation/equipamentoSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCreateTipoEquipamento, useUpdateTipoEquipamento } from '../services/equipamentoService';
import { tipoEquipamentoSchema } from '../validation/equipamentoSchema';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tipo?: TipoEquipamento | null;
};

export function TipoEquipamentoSheet({ open, onOpenChange, tipo }: Props) {
  const isEditMode = !!tipo;
  const form = useForm<TipoEquipamentoFormValues>({
    resolver: zodResolver(tipoEquipamentoSchema),
    defaultValues: { nome: '', isDetalhamentoObrigatorio: false },
  });

  useEffect(() => {
    if (tipo) {
      form.reset({ nome: tipo.nome, isDetalhamentoObrigatorio: tipo.isDetalhamentoObrigatorio });
    } else {
      form.reset({ nome: '', isDetalhamentoObrigatorio: false });
    }
  }, [tipo, form]);

  const createMutation = useCreateTipoEquipamento();
  const updateMutation = useUpdateTipoEquipamento();

  const handleSuccess = () => {
    toast.success(`Tipo de equipamento ${isEditMode ? 'atualizado' : 'criado'} com sucesso!`);
    onOpenChange(false);
  };

  const onSubmit = (values: TipoEquipamentoFormValues) => {
    if (isEditMode) {
      updateMutation.mutate({ id: tipo.id, ...values }, { onSuccess: handleSuccess });
    } else {
      createMutation.mutate(values, { onSuccess: handleSuccess });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{isEditMode ? 'Editar Tipo de Equipamento' : 'Criar Novo Tipo de Equipamento'}</SheetTitle>
          <SheetDescription>
            {isEditMode ? 'Atualize o nome da categoria.' : 'Crie uma nova categoria para os equipamentos.'}
          </SheetDescription>
        </SheetHeader>
        <div className="py-8">
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
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isEditMode} />
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
              <SheetFooter className="pt-6">
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Salvando...' : 'Salvar'}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
