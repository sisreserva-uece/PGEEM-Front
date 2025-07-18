import type { SignInFormValues } from '../types';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { useRouter } from '@/lib/i18nNavigation';
import { useAuthStore } from '@/lib/store/authStore';
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
      const signinResponse = await authService.signIn(credentials);
      const accessToken = signinResponse.data.data!.token;
      Cookies.set('token', accessToken, { expires: 1 });
      return await authService.getMe();
    },
    onSuccess: (userResponse) => {
      const user = userResponse.data.data!;
      setAuth(user);
      toast.success('Login realizado com sucesso!');
      router.push('/dashboard');
    },
  });

  return { signIn, isPending, error };
}
