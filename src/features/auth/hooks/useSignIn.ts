import type { SignInFormValues } from '../types';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from '@/lib/i18nNavigation';
import { useAuthStore } from '@/lib/store/authStore';
import { authService } from '../services/auth.service';

export function useSignIn() {
  const router = useRouter();
  const setToken = useAuthStore(state => state.setToken);

  const {
    mutate: signIn,
    isPending,
    error,
  } = useMutation({
    mutationFn: (credentials: SignInFormValues) => authService.signIn(credentials),
    onSuccess: (data) => {
      setToken(data.token);
      toast.success('Login realizado com sucesso!');
      router.push('/dashboard');
    },
    onError: (err) => {
      toast.error(err.message || 'Erro ao fazer login. Tente novamente.');
    },
  });

  return { signIn, isPending, error };
}
