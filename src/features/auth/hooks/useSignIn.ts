import type { SignInFormValues } from '../types';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useRouter } from '@/lib/i18nNavigation';
import { authService } from '../services/authService';

export function useSignIn() {
  const router = useRouter();
  const setAccessToken = useAuthStore(state => state.setAccessToken);
  const {
    mutate: signIn,
    isPending,
    error,
  } = useMutation({
    mutationFn: (credentials: SignInFormValues) => {
      return authService.signIn(credentials);
    },
    onSuccess: (response) => {
      const accessToken = response.data.data?.token as string;
      setAccessToken(accessToken);
      toast.success('Login realizado com sucesso!');
      router.replace('/dashboard');
    },
  });
  return { signIn, isPending, error };
}
