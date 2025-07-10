import type { SignUpFormValues } from '../types';
import { useRouter } from '@/lib/i18nNavigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authService } from '../services/auth.service';

export function useSignUp() {
  const router = useRouter();

  const { mutate: signUp, isPending } = useMutation({
    mutationFn: (data: SignUpFormValues) => {
      const requestData = {
        ...data,
        matricula: data.matricula,
        instituicaoId: '9a379f24-abe3-49a4-b8fd-1d8a9149f3d1',
        refreshTokenEnabled: true,
        cargosNome: data.cargosNome,
      };
      delete (requestData as any).confirmSenha;
      return authService.signUp(requestData);
    },
    onSuccess: () => {
      toast.success('Conta criada com sucesso! Faça login para continuar.');
      router.push('/');
    },
    onError: (err) => {
      toast.error(err.message || 'Erro ao criar conta. Verifique seus dados.');
    },
  });

  return { signUp, isPending };
}
