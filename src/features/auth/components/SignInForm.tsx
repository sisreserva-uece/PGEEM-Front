'use client';

import type { SignInFormValues } from '../types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormHeader } from '@/components/ui/typography';
import { useRouter } from '@/lib/i18nNavigation';
import { useSignIn } from '../hooks/useSignIn';
import { signInSchema } from '../types';

export function SignInForm() {
  const t = useTranslations('loginPage');
  const router = useRouter();
  const { signIn, isPending } = useSignIn();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      senha: '',
    },
  });

  const onSubmit = (data: SignInFormValues) => {
    signIn(data);
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
    <>
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
            <FormHeader
              title={t('h1')}
              subtitle={t('h2')}
            />
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite seu email"
                  className="w-full"
                  disabled={isPending}
                  {...register('email')}
                />
                {errors.email && <p className="text-sm font-medium text-red-500 mt-1">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="senha" className="text-sm font-medium text-gray-700">
                  {t('password')}
                </Label>
                <Input
                  id="senha"
                  type="password"
                  placeholder={t('passwordPlaceholder')}
                  className="w-full"
                  disabled={isPending}
                  {...register('senha')}
                />
                {errors.senha && <p className="text-sm font-medium text-red-500 mt-1">{errors.senha.message}</p>}
              </div>
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
          </div>
        </div>
      </div>
    </>
  );
}
