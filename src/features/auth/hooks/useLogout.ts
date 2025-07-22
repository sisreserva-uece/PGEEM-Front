import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useRouter } from '@/lib/i18nNavigation';
import { authService } from '../services/authService';

export function useLogout() {
  const clearAuth = useAuthStore(state => state.clearAuth);
  const router = useRouter();
  const { mutate: logout, isPending } = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      router.replace('/signin');
      clearAuth();
    },
    onError: () => {
      router.replace('/signin');
      clearAuth();
    },
  });
  return { logout, isPending };
}
