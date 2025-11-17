import { useQuery } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';

export const useMe = () => {
  const accessToken = useAuthStore(state => state.accessToken);
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const response = await authService.getMe();
      return response.data.data!;
    },
    enabled: !!accessToken,
    retry: false,
  });
};
