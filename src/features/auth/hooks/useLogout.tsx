import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import { logoutAction } from '../actions/authActions'; 

export function useLogout() {
  const { clearAuth } = useAuthStore();

  const { mutate: logout, isPending } = useMutation({
    mutationFn: async () => {
      await authService.logout();
      await logoutAction();
    },
    onSettled: () => {
      clearAuth();
      
      localStorage.clear();
      sessionStorage.clear();
      
      document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      window.location.href = '/signin';
    },
  });

  return { logout, isPending };
}
