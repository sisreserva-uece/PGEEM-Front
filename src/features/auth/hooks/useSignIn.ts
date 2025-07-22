import type { SignInFormValues } from '../types';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useRouter } from '@/lib/i18nNavigation';
import { authService } from '../services/authService';

export function useSignIn() {
  const router = useRouter();
  const setAuth = useAuthStore(state => state.setAuth);
  const {
    mutate: signIn,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (credentials: SignInFormValues) => {
      const loginResponse = await authService.signIn(credentials);
      const accessToken = loginResponse.data.data?.token as string;
      useAuthStore.getState().setAccessToken(accessToken);
      const userResponse = await authService.getMe();
      return { user: userResponse.data.data!, accessToken };
    },
    onSuccess: ({ user, accessToken }) => {
      setAuth(user, accessToken);
      toast.success('Login realizado com sucesso!');
      router.replace('/dashboard');
    },
  });

  return { signIn, isPending, error };
}
