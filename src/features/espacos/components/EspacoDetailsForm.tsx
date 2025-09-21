'use client';

import type { z } from 'zod';
import type { Espaco } from '@/features/espacos/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Info } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateEspaco, useGetSelectOptions, useUpdateEspaco } from '../services/espacoService';
import { espacoFormSchema } from '../validation/espacoSchema';

type EspacoFormData = z.infer<typeof espacoFormSchema>;

type EspacoDetailsFormProps = {
  entity?: Espaco | null;
  onSuccess: () => void;
};

const initialValues: EspacoFormData = {
  nome: '',
  urlCnpq: '',
  observacao: '',
  departamentoId: '',
  localizacaoId: '',
  tipoEspacoId: '',
  tipoAtividadeId: '',
  precisaProjeto: false,
};

export function EspacoDetailsForm({ entity: espaco, onSuccess }: EspacoDetailsFormProps) {
  const isEditMode = !!espaco;
  const form = useForm<EspacoFormData>({
    resolver: zodResolver(espacoFormSchema),
    defaultValues: isEditMode && espaco
      ? {
          nome: espaco.nome,
          urlCnpq: espaco.urlCnpq || '',
          observacao: espaco.observacao || '',
          departamentoId: espaco.departamento.id,
          localizacaoId: espaco.localizacao.id,
          tipoEspacoId: espaco.tipoEspaco.id,
          tipoAtividadeId: espaco.tipoAtividade.id,
          precisaProjeto: espaco.precisaProjeto,
        }
      : initialValues,
  });

  const { data: departamentos } = useGetSelectOptions('/departamento', 'departamentos');
  const { data: localizacoes } = useGetSelectOptions('/localizacao', 'localizacoes');
  const { data: tiposEspaco } = useGetSelectOptions('/espaco/tipo', 'tiposEspaco');
  const { data: tiposAtividade } = useGetSelectOptions('/atividade/tipo', 'tiposAtividade');
  const createMutation = useCreateEspaco();
  const updateMutation = useUpdateEspaco();

  const onSubmit = (values: EspacoFormData) => {
    const promise = isEditMode
      ? updateMutation.mutateAsync({
          id: espaco.id,
          nome: values.nome,
          urlCnpq: values.urlCnpq,
          observacao: values.observacao,
          precisaProjeto: values.precisaProjeto,
        })
      : createMutation.mutateAsync(values);
    toast.promise(promise, {
      loading: `${isEditMode ? 'Atualizando' : 'Criando'} espaço...`,
      success: () => {
        onSuccess();
        return `Espaço ${isEditMode ? 'atualizado' : 'criado'} com sucesso!`;
      },
      error: err => `Erro ao ${isEditMode ? 'atualizar' : 'criar'} espaço: ${err.message}`,
    });
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
          <div className="sm:col-span-2">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Espaço</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Laboratório de Redes de Computadores" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="departamentoId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departamento</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={isEditMode}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um departamento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departamentos?.map(dep => (
                      <SelectItem key={dep.id} value={dep.id}>{dep.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="localizacaoId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Localização</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={isEditMode}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma localização" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {localizacoes?.map(loc => (
                      <SelectItem key={loc.id} value={loc.id}>{loc.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tipoEspacoId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Espaço</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={isEditMode}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um tipo de espaço" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tiposEspaco?.map(tipo => (
                      <SelectItem key={tipo.id} value={tipo.id}>{tipo.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tipoAtividadeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Atividade Principal</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={isEditMode}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um tipo de atividade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tiposAtividade?.map(tipo => (
                      <SelectItem key={tipo.id} value={tipo.id}>{tipo.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {isEditMode && (
            <div className="sm:col-span-2 flex items-start gap-2.5 text-red-700 border border-red-200 bg-red-50 p-3 rounded-md">
              <Info className="h-4 w-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-xs font-medium">
                Os campos de relacionamento (Departamento, Localização, etc.) são definidos na criação e não podem ser alterados posteriormente.
              </p>
            </div>
          )}
          <div className="sm:col-span-2">
            <FormField
              control={form.control}
              name="urlCnpq"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL do CNPq (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="http://dgp.cnpq.br/dgp/espelhogrupo/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="sm:col-span-2">
            <FormField
              control={form.control}
              name="observacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observação (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Qualquer informação adicional sobre o espaço." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="sm:col-span-2">
            <FormField
              control={form.control}
              name="precisaProjeto"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Precisa de Projeto?</FormLabel>
                    <FormDescription>
                      Marque se o uso deste espaço requer a submissão de um projeto.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
