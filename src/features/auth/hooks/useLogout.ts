import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@/lib/i18nNavigation';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';

export function useLogout() {
  const { clearAuth } = useAuthStore();
  const router = useRouter();

  const { mutate: logout, isPending } = useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      clearAuth();
      router.push('/signin');
    },
  });

  return { logout, isPending };
}
