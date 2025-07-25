'use client';

import type { ProjetoCreatePayload, ProjetoFormValues } from '../validation/projetoSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useUserAccess } from '@/features/auth/hooks/useUserAccess';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useGetUsuarios } from '@/features/espacos/services/espacoService';
import { useGetInstituicoes } from '@/features/usuarios/services/usuarioService';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { useCreateProjeto } from '../services/projetoService';
import { projetoFormSchema } from '../validation/projetoSchema';

type Props = {
  onSuccess: () => void;
};

export function ProjetoForm({ onSuccess }: Props) {
  const { user } = useAuthStore();
  const access = useUserAccess();
  const { data: allInstituicoes, isLoading: isLoadingInstituicoes } = useGetInstituicoes();

  const form = useForm<ProjetoFormValues>({
    resolver: zodResolver(projetoFormSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      usuarioResponsavelId: '',
      instituicaoId: user?.instituicao.id, // Sensible default for all users
    },
  });

  const [userSearch, setUserSearch] = useState('');
  const debouncedUserSearch = useDebounce(userSearch, 500);
  const { data: usersData, isLoading: isLoadingUsers } = useGetUsuarios({ nome: debouncedUserSearch, size: 10 });
  const createMutation = useCreateProjeto();

  const onSubmit = (values: ProjetoFormValues) => {
    const payload: ProjetoCreatePayload = {
      ...values,
      dataInicio: format(values.dataInicio, 'yyyy-MM-dd'),
      dataFim: format(values.dataFim, 'yyyy-MM-dd'),
    };
    toast.promise(createMutation.mutateAsync(payload), {
      loading: 'Criando projeto...',
      success: () => {
        onSuccess();
        return 'Projeto criado com sucesso!';
      },
      error: 'Falha ao criar o projeto.',
    });
  };

  const selectedUserName = useMemo(() => {
    const userId = form.watch('usuarioResponsavelId');
    if (!userId) {
      return 'Selecione um usuário responsável';
    }
    return usersData?.content.find(u => u.id === userId)?.nome ?? 'Selecione um usuário responsável';
  }, [form.watch('usuarioResponsavelId'), usersData?.content]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Projeto</FormLabel>
              <FormControl><Input placeholder="Nome do projeto de pesquisa ou extensão" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl><Textarea placeholder="Descreva os objetivos e o escopo do projeto." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dataInicio"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Início</FormLabel>
                <FormControl><DateTimePicker mode="date" value={field.value} onChange={field.onChange} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dataFim"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Fim</FormLabel>
                <FormControl><DateTimePicker mode="date" value={field.value} onChange={field.onChange} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="usuarioResponsavelId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Usuário Responsável</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline" role="combobox" className="w-full justify-between">
                      {selectedUserName}
                      <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder="Buscar usuário..." value={userSearch} onValueChange={setUserSearch} />
                    <CommandEmpty>Nenhum usuário encontrado.</CommandEmpty>
                    <CommandList>
                      {isLoadingUsers && <CommandItem>Carregando...</CommandItem>}
                      <CommandGroup>
                        {usersData?.content.map(u => (
                          <CommandItem value={u.nome} key={u.id} onSelect={() => field.onChange(u.id)}>
                            {u.nome}
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

        {/* --- NEW CONDITIONAL INSTITUTION FIELD --- */}
        <FormField
          control={form.control}
          name="instituicaoId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instituição</FormLabel>
              {access.isAdmin
                ? (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoadingInstituicoes}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma instituição" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {allInstituicoes?.map(inst => (
                          <SelectItem key={inst.id} value={inst.id}>
                            {inst.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )
                : (
                    <FormControl>
                      <Input value={user?.instituicao.nome ?? 'Carregando...'} disabled />
                    </FormControl>
                  )}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Salvando...' : 'Salvar Projeto'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
