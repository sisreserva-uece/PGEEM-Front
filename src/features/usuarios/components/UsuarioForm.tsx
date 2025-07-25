'use client';

import type { Usuario } from '../types';
import type { UsuarioFormValues } from '../validation/usuarioSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetCargos, useGetInstituicoes, useUpdateUsuario } from '../services/usuarioService';
import { updateUsuarioFormSchema } from '../validation/usuarioSchema';

type Props = {
  entity?: Usuario | null;
  onSuccess: () => void;
};

export function UsuarioForm({ entity: usuario, onSuccess }: Props) {
  const form = useForm<UsuarioFormValues>({
    resolver: zodResolver(updateUsuarioFormSchema),
    values: {
      nome: usuario?.nome ?? '',
      fotoPerfil: usuario?.fotoPerfil ?? '',
      matricula: usuario?.matricula ?? undefined,
      telefone: usuario?.telefone ?? '',
      instituicaoId: usuario?.instituicao.id ?? '',
      refreshTokenEnabled: usuario?.refreshTokenEnabled ?? false,
      cargosId: usuario?.cargos.map(c => c.id) ?? [],
    },
  });

  const { data: allCargos, isLoading: isLoadingCargos } = useGetCargos();
  const { data: allInstituicoes, isLoading: isLoadingInstituicoes } = useGetInstituicoes();
  const updateMutation = useUpdateUsuario();

  const onSubmit = async (values: UsuarioFormValues) => {
    if (!usuario) {
      return;
    }
    await toast.promise(updateMutation.mutateAsync({ id: usuario.id, ...values }), {
      loading: 'Atualizando usuário...',
      success: 'Usuário atualizado com sucesso!',
      error: 'Erro ao atualizar usuário.',
    });
    onSuccess();
  };

  if (isLoadingCargos || isLoadingInstituicoes) {
    return <Skeleton className="h-96 w-full" />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="dados-principais" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dados-principais">Dados Principais</TabsTrigger>
            <TabsTrigger value="cargos">Cargos & Permissões</TabsTrigger>
          </TabsList>

          <TabsContent value="dados-principais" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                name="nome"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="matricula"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Matrícula</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="telefone"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="fotoPerfil"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da Foto de Perfil</FormLabel>
                    <FormControl><Input type="url" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              name="instituicaoId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instituição</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione uma instituição" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {allInstituicoes?.map(i => <SelectItem key={i.id} value={i.id}>{i.nome}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="refreshTokenEnabled"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3 rounded-md border p-4">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Habilitar Sessão Contínua</FormLabel>
                    <p className="text-xs text-muted-foreground">
                      Permite que o usuário permaneça logado por longos períodos.
                    </p>
                  </div>
                </FormItem>
              )}
            />
          </TabsContent>
          <TabsContent value="cargos" className="mt-6 space-y-6">
            <FormField
              name="cargosId"
              control={form.control}
              render={() => (
                <FormItem>
                  <FormLabel>Cargos</FormLabel>
                  <div className="space-y-2 rounded-md border p-4">
                    {allCargos?.map(cargo => (
                      <FormField
                        key={cargo.id}
                        name="cargosId"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(cargo.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, cargo.id])
                                    : field.onChange(field.value?.filter(id => id !== cargo.id));
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{cargo.nome}</FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
