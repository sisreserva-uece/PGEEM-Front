'use client';

import type { Comite } from '../types';
import type { ComiteFormValues } from '../validation/comiteSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCreateComite, useUpdateComite } from '../services/comiteService';
import { ComiteTipoMap } from '../types';
import { comiteFormSchema } from '../validation/comiteSchema';
import { ManageMembrosTab } from './ManageMembrosTab';

type Props = {
  entity?: Comite | null;
  onSuccess: () => void;
};

export function ComiteForm({ entity: comite, onSuccess }: Props) {
  const isEditMode = !!comite;

  const form = useForm<ComiteFormValues>({
    resolver: zodResolver(comiteFormSchema),
    defaultValues: isEditMode ? { descricao: comite.descricao, tipo: comite.tipo } : { descricao: '', tipo: undefined },
  });

  const createMutation = useCreateComite();
  const updateMutation = useUpdateComite();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (values: ComiteFormValues) => {
    const promise = isEditMode
      ? updateMutation.mutateAsync({ id: comite.id, descricao: values.descricao })
      : createMutation.mutateAsync(values);

    toast.promise(promise, {
      loading: `${isEditMode ? 'Atualizando' : 'Criando'} comitê...`,
      success: () => {
        onSuccess();
        return `Comitê ${isEditMode ? 'atualizado' : 'criado'} com sucesso!`;
      },
      error: err => `Erro ao salvar: ${err.message}`,
    });
  };

  return (
    <Tabs defaultValue="dados-principais" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="dados-principais">Dados Principais</TabsTrigger>
        <TabsTrigger value="membros" disabled={!isEditMode}>Membros</TabsTrigger>
      </TabsList>

      <TabsContent value="dados-principais" className="mt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl><Input placeholder="Ex: Comitê de Ética em Pesquisa" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Comitê</FormLabel>
                  <Select
                    onValueChange={value => field.onChange(Number(value))}
                    value={String(field.value)}
                    disabled={isEditMode}
                  >
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione um tipo" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {Object.entries(ComiteTipoMap).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>{isLoading ? 'Salvando...' : 'Salvar Alterações'}</Button>
            </div>
          </form>
        </Form>
      </TabsContent>

      <TabsContent value="membros" className="mt-4">
        {isEditMode && comite
          ? <ManageMembrosTab comiteId={comite.id} />
          : (
              <p className="text-center text-muted-foreground p-4">Salve o comitê primeiro para poder adicionar membros.</p>
            )}
      </TabsContent>
    </Tabs>
  );
}
