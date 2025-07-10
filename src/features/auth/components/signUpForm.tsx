'use client';

import type { SignUpFormValues } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from '@/lib/i18nNavigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { Controller, useForm } from 'react-hook-form';
import { useSignUp } from '../hooks/useSignUp';
import { signUpSchema } from '../types';

export function SignupForm() {
  const router = useRouter();
  const { signUp, isPending } = useSignUp();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      nome: '',
      email: '',
      senha: '',
      confirmSenha: '',
      matricula: '',
      telefone: '',
      fotoPerfil: '',
      cargosNome: 'ALUNO',
    },
  });

  const onSubmit = (data: SignUpFormValues) => {
    signUp(data);
  };

  const handleBackToSignin = () => {
    router.push('/');
  };

  return (
    <>
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
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">CRIAR NOVA CONTA</h2>
              <p className="text-sm text-green-600 font-medium">Preencha os dados para criar sua conta</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input id="nome" type="text" placeholder="Digite seu nome" disabled={isPending} {...register('nome')} />
                  {errors.nome && <p className="text-sm font-medium text-red-500 mt-1">{errors.nome.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" placeholder="Digite seu email" disabled={isPending} {...register('email')} />
                  {errors.email && <p className="text-sm font-medium text-red-500 mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="senha">Senha *</Label>
                  <Input id="senha" type="password" placeholder="Mínimo 8 caracteres" disabled={isPending} {...register('senha')} />
                  {errors.senha && <p className="text-sm font-medium text-red-500 mt-1">{errors.senha.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmSenha">Confirmar Senha *</Label>
                  <Input id="confirmSenha" type="password" placeholder="Confirme sua senha" disabled={isPending} {...register('confirmSenha')} />
                  {errors.confirmSenha && <p className="text-sm font-medium text-red-500 mt-1">{errors.confirmSenha.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="matricula">Matrícula *</Label>
                  <Input id="matricula" type="text" inputMode="numeric" placeholder="Digite sua matrícula" disabled={isPending} {...register('matricula')} />
                  {errors.matricula && <p className="text-sm font-medium text-red-500 mt-1">{errors.matricula.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input id="telefone" type="tel" placeholder="Digite seu telefone" disabled={isPending} {...register('telefone')} />
                  {errors.telefone && <p className="text-sm font-medium text-red-500 mt-1">{errors.telefone.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cargo *</Label>
                  <Controller
                    name="cargosNome"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione seu cargo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALUNO">Aluno</SelectItem>
                          <SelectItem value="PROFESSOR">Professor</SelectItem>
                          <SelectItem value="FUNCIONARIO">Funcionário</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.cargosNome && <p className="text-sm font-medium text-red-500 mt-1">{errors.cargosNome.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fotoPerfil">URL da Foto de Perfil</Label>
                  <Input id="fotoPerfil" type="url" placeholder="URL da sua foto (opcional)" disabled={isPending} {...register('fotoPerfil')} />
                  {errors.fotoPerfil && <p className="text-sm font-medium text-red-500 mt-1">{errors.fotoPerfil.message}</p>}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackToSignin}
                  disabled={isPending}
                  className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50 font-medium bg-transparent"
                >
                  Voltar ao Login
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium"
                >
                  {isPending ? 'Criando conta...' : 'Criar Conta'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
