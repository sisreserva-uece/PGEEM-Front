import type { OnboardingFormValues } from '../types';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from '@/lib/i18nNavigation';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';

export function useOnboarding() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const { mutate: submitOnboarding, isPending } = useMutation({
    mutationFn: async (data: OnboardingFormValues) => {
      await authService.internalOnboarding(data);
      const meResponse = await authService.getMe();
      return meResponse.data.data!;
    },
    onSuccess: (user) => {
      setAuth(user);
      toast.success('Perfil completado com sucesso!');
      router.push('/dashboard');
    },
    onError: () => {
      toast.error('Erro ao completar o perfil. Verifique os dados e tente novamente.');
    },
  });

  return { submitOnboarding, isPending };
}
