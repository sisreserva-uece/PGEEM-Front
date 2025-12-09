'use client';

import type { SignInFormValues } from '../types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FormHeader } from '@/components/ui/typography';
import { loginAction } from '@/features/auth/actions/authActions';
import { useRouter } from '@/lib/i18nNavigation';
import { signInSchema } from '../types';

export function SignInForm() {
  const t = useTranslations('loginPage');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      senha: '',
    },
  });

  const onSubmit = (data: SignInFormValues) => {
    setError(null);
    startTransition(async () => {
      const result = await loginAction(data);
      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
      }
    });
  };

  const handleForgotPassword = () => {
    toast('Funcionalidade em desenvolvimento', {
      icon: '🚧',
    });
  };

  const handleSignup = () => {
    router.push('/signup');
  };

  return (
    <div className="w-full max-w-lg mx-auto">
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
          <FormHeader title={t('h1')} subtitle={t('h2')} />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Digite seu email"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="senha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('password')}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={t('passwordPlaceholder')}
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-gray-500 hover:text-gray-700 hover:underline disabled:opacity-50"
                  disabled={isPending}
                >
                  {t('forgotPassword')}
                </button>
              </div>
              <div className="flex gap-3 pt-2">
                {error && (
                  <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                    {error}
                  </div>
                )}
                <Button
                  type="submit"
                  variant="default"
                  disabled={isPending}
                  className="flex-1"
                >
                  {isPending ? 'Entrando...' : t('signIn')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSignup}
                  disabled={isPending}
                  className="flex-1"
                >
                  {t('signup')}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
