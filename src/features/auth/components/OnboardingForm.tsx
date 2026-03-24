'use client';

import type { OnboardingFormValues } from '../types';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image'; // [cite: 231]
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'; // [cite: 233]
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // [cite: 224]
import { FormHeader } from '@/components/ui/typography';
import { useGetAllInstituicoes } from '@/features/instituicao/hooks/useGetAllInstituicoes'; // [cite: 225]

import { useRouter } from '@/lib/i18nNavigation';
import { useOnboarding } from '../hooks/useOnboarding';
import { onboardingSchema } from '../types';

export function OnboardingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const { submitOnboarding, isPending } = useOnboarding();
  const { data: instituicoes, isLoading: isLoadingInstituicoes } = useGetAllInstituicoes(); // [cite: 227]

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      onboardingToken: token || '',
      matricula: '',
      telefone: '',
      documentoFiscal: '',
      instituicaoId: '',
    },
  });

  useEffect(() => {
    if (!token) {
      router.push('/signin');
    }
  }, [token, router]);

  if (!token) {
    return null;
  }

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
            title="COMPLETE SEU PERFIL"
            subtitle="Precisamos de mais algumas informações para finalizar seu acesso."
          />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(data => submitOnboarding(data))} className="space-y-4 mt-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="matricula"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Matrícula *</FormLabel>
                      <FormControl><Input inputMode="numeric" placeholder="Sua matrícula" disabled={isPending} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="documentoFiscal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF *</FormLabel>
                      <FormControl><Input placeholder="Apenas números" disabled={isPending} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Celular (com DDD) *</FormLabel>
                      <FormControl><Input type="tel" placeholder="(85) 99999-9999" disabled={isPending} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="instituicaoId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instituição *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending || isLoadingInstituicoes}>
                        {' '}
                        // [cite: 252]
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={isLoadingInstituicoes ? 'Carregando...' : 'Selecione sua instituição'} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {instituicoes?.map(inst => (
                            <SelectItem key={inst.id} value={inst.id}>{inst.nome}</SelectItem> // [cite: 255]
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-4">
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? 'Finalizando...' : 'Concluir Cadastro'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
