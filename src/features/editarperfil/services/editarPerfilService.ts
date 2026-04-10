import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store/authStore';
import apiClient from '@/lib/api/apiClient';
import type { UserProfile } from '@/features/auth/types/index';
import type { ProfileUpdatePayload } from '@/features/auth/schemas/profileSchema';

/**
 * Hook para atualizar o perfil do usuário logado.
 */
export function useUpdateMe() {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore(state => state.setAuth);
  const user = useAuthStore(state => state.user);

  return useMutation({
    mutationFn: async (data: ProfileUpdatePayload) => {
      if (!user?.id) {
        throw new Error('Usuário não identificado para realizar a atualização.');
      }

      const response = await apiClient.put<{ data: UserProfile }>(
        `/auth/usuario/${user.id}`,
        data
      );
      
      return response.data.data;
    },
    onSuccess: (updatedUser) => {
      setAuth(updatedUser);

      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
      
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });
}