import type { OnboardingFormValues } from '../types';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useGetAllInstituicoes } from '@/features/instituicao/hooks/useGetAllInstituicoes';
import { useRouter } from '@/lib/i18nNavigation';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';

export function useOnboarding() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { data: instituicoes } = useGetAllInstituicoes();

  const { mutate: submitOnboarding, isPending } = useMutation({
    mutationFn: async (data: OnboardingFormValues) => {
      const uece = instituicoes?.find(i => i.nome.toLowerCase().includes('uece'));
      if (!uece) {
        throw new Error('Instituição UECE não encontrada. Tente novamente em instantes.');
      }
      await authService.internalOnboarding({ ...data, instituicaoId: uece.id });
      const meResponse = await authService.getMe();
      return meResponse.data.data!;
    },
    onSuccess: (user) => {
      setAuth(user);
      toast.success('Perfil completado com sucesso!');
      router.push('/dashboard');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao completar o perfil. Verifique os dados e tente novamente.');
    },
  });

  return { submitOnboarding, isPending };
}
