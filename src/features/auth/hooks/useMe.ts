import { useQuery } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';

export const useMe = () => {
  const user = useAuthStore(state => state.user);

  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const response = await authService.getMe();
      return response.data.data!;
    },
    enabled: !!user,
    retry: false,
  });
};
