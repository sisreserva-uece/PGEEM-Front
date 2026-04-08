import type { InternalSignInFormValues } from '../types';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from '@/lib/i18nNavigation';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';

export function useInternalSignIn() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const { mutate: internalSignIn, isPending } = useMutation({
    mutationFn: async (data: InternalSignInFormValues) => {
      const response = await authService.internalSignIn(data);
      if (response.status === 202) {
        return { type: 'onboarding', token: response.data.data.onboardingToken };
      }
      const meResponse = await authService.getMe();
      return { type: 'success', user: meResponse.data.data! };
    },
    onSuccess: (result) => {
      if (result.type === 'onboarding') {
        toast.info('Complete seu perfil para finalizar o acesso.');
        router.push(`/onboarding?token=${result.token}`);
      } else if (result.type === 'success' && result.user) {
        setAuth(result.user);
        router.push('/dashboard');
      } else {
        toast.error('Erro ao recuperar perfil do usuário.');
      }
    },
    onError: () => {
      toast.error('Credenciais inválidas ou erro no servidor.');
    },
  });

  return { internalSignIn, isPending };
}
