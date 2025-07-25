'use client';

import type { ComiteUsuarioLink } from '../types';
import type { LinkMembroFormValues } from '../validation/comiteSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetSelectOptions, useGetUsuarios } from '@/features/espacos/services/espacoService';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { useLinkUsuarioToComite, useUpdateUsuarioLink } from '../services/comiteService';
import { linkMembroFormSchema } from '../validation/comiteSchema';

type Props = {
  comiteId: string;
  entity?: ComiteUsuarioLink | null;
  onSuccess: () => void;
  existingMemberIds: string[];
};

export function LinkMembroForm({ comiteId, entity: membro, onSuccess, existingMemberIds }: Props) {
  const isEditMode = !!membro;
  const form = useForm<LinkMembroFormValues>({
    resolver: zodResolver(linkMembroFormSchema),
    values: isEditMode
      ? {
          usuarioId: membro.usuario.id,
          departamentoId: membro.departamento?.id || '',
          portaria: membro.portaria,
          descricao: membro.descricao || '',
          isTitular: membro.isTitular,
        }
      : {
          usuarioId: '',
          departamentoId: '',
          portaria: '',
          descricao: '',
          isTitular: true,
        },
  });
  const [userSearch, setUserSearch] = useState('');
  const debouncedUserSearch = useDebounce(userSearch, 500);
  const { data: usersData, isLoading: isLoadingUsers } = useGetUsuarios({ nome: debouncedUserSearch, size: 10 });
  const { data: departamentos } = useGetSelectOptions('/departamento', 'departamentos');
  const linkMutation = useLinkUsuarioToComite();
  const updateMutation = useUpdateUsuarioLink(comiteId);
  const isLoading = linkMutation.isPending || updateMutation.isPending;
  const onSubmit = async (values: LinkMembroFormValues) => {
    const mutationPromise = isEditMode
      ? await updateMutation.mutateAsync({
          id: membro.id,
          departamentoId: values.departamentoId,
          descricao: values.descricao,
          isTitular: values.isTitular,
        })
      : await linkMutation.mutateAsync({ ...values, comiteId });
    try {
      toast.promise(mutationPromise, {
        loading: `Salvando alterações...`,
        success: `Membro ${isEditMode ? 'atualizado' : 'vinculado'} com sucesso!`,
        error: 'Erro ao salvar alterações.',
      });
      onSuccess();
    } catch (error) {
    }
  };
  const availableUsers = useMemo(() => {
    if (!usersData?.content) {
      return [];
    }
    return usersData.content.filter(user => !existingMemberIds.includes(user.id));
  }, [usersData?.content, existingMemberIds]);
  const selectedUserName = useMemo(() => {
    const userId = form.getValues('usuarioId');
    if (!userId) {
      return 'Selecione um usuário';
    }
    if (membro && membro.usuario.id === userId) {
      return membro.usuario.nome;
    }
    return usersData?.content.find(u => u.id === userId)?.nome ?? 'Selecione um usuário';
  }, [form.watch('usuarioId'), usersData?.content, membro]);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="usuarioId"
          render={() => (
            <FormItem className="flex flex-col">
              <FormLabel>Usuário *</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline" role="combobox" className="w-full justify-between" disabled={isEditMode}>
                      {selectedUserName}
                      <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Buscar usuário..."
                      value={userSearch}
                      onValueChange={setUserSearch}
                      disabled={isLoadingUsers}
                    />
                    <CommandEmpty>Nenhum usuário encontrado.</CommandEmpty>
                    <CommandList>
                      <CommandGroup>
                        {availableUsers.map(user => (
                          <CommandItem
                            value={user.nome}
                            key={user.id}
                            onSelect={() => {
                              form.setValue('usuarioId', user.id);
                            }}
                          >
                            {user.nome}
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
          name="portaria"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Portaria *</FormLabel>
              <FormControl><Input placeholder="Ex: 001/2025" {...field} disabled={isEditMode} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="departamentoId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Departamento (Opcional)</FormLabel>
              <Select
                onValueChange={value => field.onChange(value === '__none__' ? '' : value)}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um departamento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="__none__">Nenhum</SelectItem>
                  {departamentos?.map(dep => <SelectItem key={dep.id} value={dep.id}>{dep.nome}</SelectItem>)}
                </SelectContent>
              </Select>
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
              <FormControl><Input placeholder="Qualquer observação" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isTitular"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Membro Titular</FormLabel>
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
