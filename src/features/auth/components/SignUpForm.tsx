'use client';

import type { SignUpFormValues } from '../types';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormHeader } from '@/components/ui/typography';
import { useRouter } from '@/lib/i18nNavigation';
import { useSignUp } from '../hooks/useSignUp';
import { signUpSchema } from '../types';

export function SignUpForm() {
  const router = useRouter();
  const { signUp, isPending } = useSignUp();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      nome: '',
      email: '',
      senha: '',
      confirmSenha: '',
      matricula: '',
      telefone: '',
      documentoFiscal: '',
      fotoPerfil: '',
      cargosNome: 'ALUNO',
    },
  });

  const onSubmit = (data: SignUpFormValues) => {
    signUp(data);
  };

  const handleBackToSignin = () => {
    router.push('/signin');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg rounded-lg shadow-2xl overflow-hidden">
        <div className="w-full">
          <Image
            src="/assets/images/signIn/bgImage.png"
            alt="Universidade Estadual do Ceará"
            width={600}
            height={200}
            className="w-full h-auto"
            priority
          />
        </div>
        <div className="p-8">
          <FormHeader
            title="CRIAR NOVA CONTA"
            subtitle="Preencha os dados para criar sua conta"
          />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo *</FormLabel>
                      <FormControl><Input placeholder="Digite seu nome" disabled={isPending} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl><Input type="email" placeholder="Digite seu email" disabled={isPending} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="senha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha *</FormLabel>
                      <FormControl><Input type="password" placeholder="Mínimo 8 caracteres" disabled={isPending} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmSenha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Senha *</FormLabel>
                      <FormControl><Input type="password" placeholder="Confirme sua senha" disabled={isPending} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="matricula"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Matrícula *</FormLabel>
                      <FormControl><Input inputMode="numeric" placeholder="Digite sua matrícula" disabled={isPending} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone *</FormLabel>
                      <FormControl><Input type="tel" placeholder="Digite seu telefone" disabled={isPending} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="documentoFiscal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Documento Fiscal *</FormLabel>
                      <FormControl><Input placeholder="Digite seu Documento Fiscal" disabled={isPending} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cargosNome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cargo *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Selecione seu cargo" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ALUNO">Aluno</SelectItem>
                          <SelectItem value="PROFESSOR">Professor</SelectItem>
                          <SelectItem value="FUNCIONARIO">Funcionário</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fotoPerfil"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL da Foto de Perfil</FormLabel>
                      <FormControl><Input type="url" placeholder="URL da sua foto (opcional)" disabled={isPending} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackToSignin}
                  disabled={isPending}
                  className="flex-1"
                >
                  Voltar ao Login
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="flex-1"
                >
                  {isPending ? 'Criando conta...' : 'Criar Conta'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
