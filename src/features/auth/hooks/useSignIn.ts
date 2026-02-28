import type { SignInFormValues } from '../types';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@/lib/i18nNavigation';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';

export function useSignIn() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const { mutate: signIn, isPending } = useMutation({
    mutationFn: async (data: SignInFormValues) => {
      await authService.signIn(data);
      const meResponse = await authService.getMe();
      return meResponse.data.data!;
    },
    onSuccess: (user) => {
      setAuth(user);
      router.push('/dashboard');
    },
  });

  return { signIn, isPending };
}
