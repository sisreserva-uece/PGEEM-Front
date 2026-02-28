'use client';

import type { z } from 'zod';
import type { Espaco } from '@/features/espacos/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown, Info } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
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
  tipoAtividadeIds: [],
  precisaProjeto: false,
  multiusuario: false,
  reservavel: false,
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
          tipoAtividadeIds: espaco.tiposAtividade.map(t => t.id),
          precisaProjeto: espaco.precisaProjeto,
          multiusuario: espaco.multiusuario,
          reservavel: espaco.reservavel,
        }
      : initialValues,
  });

  const { data: departamentos = [] } = useGetSelectOptions('/departamento', 'departamentos');
  const { data: localizacoes = [] } = useGetSelectOptions('/localizacao', 'localizacoes');
  const { data: tiposEspaco = [] } = useGetSelectOptions('/espaco/tipo', 'tiposEspaco');
  const { data: tiposAtividade = [] } = useGetSelectOptions('/atividade/tipo', 'tiposAtividade');
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
          multiusuario: values.multiusuario,
          reservavel: values.reservavel, // ← ADD
          tipoAtividadeIds: values.tipoAtividadeIds,
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
              <FormItem className="flex flex-col">
                <FormLabel>Departamento</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}
                        disabled={isEditMode}
                      >
                        {field.value ? departamentos.find(dep => dep.id === field.value)?.nome : 'Selecione um departamento'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput placeholder="Buscar departamento..." />
                      <CommandList>
                        <CommandEmpty>Nenhum departamento encontrado.</CommandEmpty>
                        <CommandGroup>
                          {departamentos.map(dep => (
                            <CommandItem
                              value={dep.nome}
                              key={dep.id}
                              onSelect={() => field.onChange(dep.id)}
                            >
                              <Check className={cn('mr-2 h-4 w-4', dep.id === field.value ? 'opacity-100' : 'opacity-0')} />
                              {dep.nome}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="localizacaoId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Localização</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}
                        disabled={isEditMode}
                      >
                        {field.value ? localizacoes.find(loc => loc.id === field.value)?.nome : 'Selecione uma localização'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput placeholder="Buscar localização..." />
                      <CommandList>
                        <CommandEmpty>Nenhuma localização encontrada.</CommandEmpty>
                        <CommandGroup>
                          {localizacoes.map(loc => (
                            <CommandItem
                              value={loc.nome}
                              key={loc.id}
                              onSelect={() => field.onChange(loc.id)}
                            >
                              <Check className={cn('mr-2 h-4 w-4', loc.id === field.value ? 'opacity-100' : 'opacity-0')} />
                              {loc.nome}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tipoEspacoId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tipo de Espaço</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}
                        disabled={isEditMode}
                      >
                        {field.value ? tiposEspaco.find(tipo => tipo.id === field.value)?.nome : 'Selecione um tipo de espaço'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput placeholder="Buscar tipo..." />
                      <CommandList>
                        <CommandEmpty>Nenhum tipo encontrado.</CommandEmpty>
                        <CommandGroup>
                          {tiposEspaco.map(tipo => (
                            <CommandItem
                              value={tipo.nome}
                              key={tipo.id}
                              onSelect={() => field.onChange(tipo.id)}
                            >
                              <Check className={cn('mr-2 h-4 w-4', tipo.id === field.value ? 'opacity-100' : 'opacity-0')} />
                              {tipo.nome}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tipoAtividadeIds"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tipos de Atividade</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn('w-full justify-between h-auto min-h-[40px]', !field.value?.length && 'text-muted-foreground')}
                      >
                        <div className="flex flex-wrap gap-1 items-center">
                          {field.value && field.value.length > 0
                            ? (
                                field.value.map((id) => {
                                  const item = tiposAtividade.find(t => t.id === id);
                                  return (
                                    <Badge key={id} variant="secondary" className="mr-1">
                                      {item?.nome || '...'}
                                    </Badge>
                                  );
                                })
                              )
                            : (
                                'Selecione as atividades'
                              )}
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput placeholder="Buscar atividade..." />
                      <CommandList>
                        <CommandEmpty>Nenhuma atividade encontrada.</CommandEmpty>
                        <CommandGroup>
                          {tiposAtividade.map(tipo => (
                            <CommandItem
                              key={tipo.id}
                              value={tipo.nome}
                              onSelect={() => {
                                const current = field.value || [];
                                const isSelected = current.includes(tipo.id);
                                if (isSelected) {
                                  field.onChange(current.filter(id => id !== tipo.id));
                                } else {
                                  field.onChange([...current, tipo.id]);
                                }
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  field.value?.includes(tipo.id) ? 'opacity-100' : 'opacity-0',
                                )}
                              />
                              {tipo.nome}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
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

          <div className="sm:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="precisaProjeto"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Precisa de Projeto?</FormLabel>
                    <FormDescription>
                      Requer submissão de projeto para reserva.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="multiusuario"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Espaço Multiusuário?</FormLabel>
                    <FormDescription>
                      Pode ser usado por diferentes grupos.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reservavel"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Pode ser Reservado?</FormLabel>
                    <FormDescription>
                      Permite que o espaço receba solicitações de reserva.
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
