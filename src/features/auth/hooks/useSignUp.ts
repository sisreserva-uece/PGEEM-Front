import type { SignUpFormValues, SignUpRequest } from '../types';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from '@/lib/i18nNavigation';
import { authService } from '../services/authService';

export function useSignUp() {
  const router = useRouter();
  const { mutate: signUp, isPending } = useMutation({
    mutationFn: (data: SignUpFormValues) => {
      const requestData: SignUpRequest = {
        ...data,
        cargosNome: [data.cargosNome],
        refreshTokenEnabled: true,
      };
      return authService.signUp(requestData);
    },
    onSuccess: () => {
      toast.success('Conta criada com sucesso! Faça login para continuar.');
      router.push('/');
    },
  });
  return { signUp, isPending };
}
