// C:\Users\rerse\WebstormProjects\PGEEM-Front\src\features\espacos\components\EspacoForm.tsx
'use client';

import type { z } from 'zod';
import type { Espaco } from '../types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ManageGestoresTab } from '@/features/espacos/components/ManageGestoresTab';
import { useCreateEspaco, useGetSelectOptions, useUpdateEspaco } from '../services/espacoService';
import { espacoFormSchema } from '../validation/espacoSchema';

type EspacoFormData = z.infer<typeof espacoFormSchema>;

type EspacoFormProps = {
  espaco?: Espaco | null;
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

export function EspacoForm({ espaco, onSuccess }: EspacoFormProps) {
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
      ? updateMutation.mutateAsync({ id: espaco.id, ...values })
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
    <Tabs defaultValue="dados-principais" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="dados-principais">Dados Principais</TabsTrigger>
        <TabsTrigger value="gestores" disabled={!isEditMode}>Gestores</TabsTrigger>
        <TabsTrigger value="equipamentos" disabled={!isEditMode}>Equipamentos</TabsTrigger>
      </TabsList>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (values) => {
            onSubmit(values);
            onSuccess();
          })}
          className="space-y-8"
        >
          <TabsContent value="dados-principais" className="mt-6">
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
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
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
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
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
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
          </TabsContent>

          <TabsContent value="gestores" className="mt-4">
            {isEditMode && espaco
              ? (
                  <ManageGestoresTab espacoId={espaco.id} />
                )
              : (
                  <p className="text-center text-muted-foreground p-4">
                    Salve o espaço primeiro para poder adicionar gestores.
                  </p>
                )}
          </TabsContent>

          <TabsContent value="equipamentos" className="mt-4">
            <h3 className="text-lg font-semibold">Gerenciar Equipamentos</h3>
            <p className="text-sm text-muted-foreground">Adicione ou remova equipamentos neste espaço.</p>
            {/* TODO: Implement a component here to list, add, and remove equipamentos */}
            <div className="border rounded-lg p-4 mt-2 h-32 flex items-center justify-center">
              (Interface de gerenciamento de equipamentos virá aqui)
            </div>
          </TabsContent>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </Form>
    </Tabs>
  );
}
