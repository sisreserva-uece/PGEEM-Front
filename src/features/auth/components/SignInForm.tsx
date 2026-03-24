'use client';

import type { InternalSignInFormValues, SignInFormValues } from '../types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormHeader } from '@/components/ui/typography';
import { useRouter } from '@/lib/i18nNavigation';
import { useInternalSignIn } from '../hooks/useInternalSignIn';
import { useSignIn } from '../hooks/useSignIn';
import { internalSignInSchema, signInSchema } from '../types';

export function SignInForm() {
  const t = useTranslations('loginPage');
  const router = useRouter();
  const { signIn, isPending: isExternalPending } = useSignIn();
  const { internalSignIn, isPending: isInternalPending } = useInternalSignIn();
  const isPending = isExternalPending || isInternalPending;
  const externalForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', senha: '' },
  });
  const internalForm = useForm<InternalSignInFormValues>({
    resolver: zodResolver(internalSignInSchema),
    defaultValues: { login: '', senha: '' },
  });
  const handleSignup = () => router.push('/signup');
  const handleForgotPassword = () => toast('Funcionalidade em desenvolvimento', { icon: '🚧' });
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

          <Tabs defaultValue="internal" className="w-full mt-6">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="internal">Usuário UECE</TabsTrigger>
              <TabsTrigger value="external">Visitante</TabsTrigger>
            </TabsList>

            <TabsContent value="internal">
              <Form {...internalForm}>
                <form onSubmit={internalForm.handleSubmit(data => internalSignIn(data))} className="space-y-4">
                  <FormField
                    control={internalForm.control}
                    name="login"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Login Institucional</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Login da UECE (sem domínio)"
                            disabled={isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={internalForm.control}
                    name="senha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('password')}</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder={t('passwordPlaceholder')} disabled={isPending} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1" disabled={isPending}>
                      {isPending ? 'Entrando...' : t('signIn')}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="external">
              <Form {...externalForm}>
                <form onSubmit={externalForm.handleSubmit(data => signIn(data))} className="space-y-4">
                  <FormField
                    control={externalForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Digite seu email" disabled={isPending} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={externalForm.control}
                    name="senha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('password')}</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder={t('passwordPlaceholder')} disabled={isPending} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="text-center">
                    <button type="button" onClick={handleForgotPassword} className="text-sm text-gray-500 hover:text-gray-700 hover:underline disabled:opacity-50" disabled={isPending}>
                      {t('forgotPassword')}
                    </button>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button type="submit" variant="default" disabled={isPending} className="flex-1">
                      {isPending ? 'Entrando...' : t('signIn')}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleSignup} disabled={isPending} className="flex-1">
                      {t('signup')}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
          </Tabs>

        </div>
      </div>
    </div>
  );
}
