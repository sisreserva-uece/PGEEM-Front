import type { Comite, ComiteUsuarioLink } from '../types';
import type {
  ComiteCreatePayload,
  ComiteUpdatePayload,
  LinkMembroCreatePayload,
  UpdateMembroLinkPayload,
} from '../validation/comiteSchema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/apiClient';
import { createCrudHooks } from '@/lib/hooks/useCrud';

export const {
  useGet: useGetComites,
  useCreate: useCreateComite,
  useUpdate: useUpdateComite,
} = createCrudHooks<Comite, ComiteCreatePayload, ComiteUpdatePayload>('comite');

const comiteUsuarioKeys = {
  all: (comiteId: string) => ['comiteUsuarios', comiteId] as const,
};

export function useGetComiteUsuarios(comiteId: string) {
  return useQuery({
    queryKey: comiteUsuarioKeys.all(comiteId),
    queryFn: async () => {
      const response = await apiClient.get<{ data: { content: ComiteUsuarioLink[] } }>('/comite/usuario', {
        params: { comiteId },
      });
      return response.data.data.content;
    },
    enabled: !!comiteId,
  });
}

export function useLinkUsuarioToComite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LinkMembroCreatePayload) => apiClient.post('/comite/usuario', data),
    onSuccess: (_, variables) => {
      return queryClient.invalidateQueries({ queryKey: comiteUsuarioKeys.all(variables.comiteId) });
    },
  });
}

export function useUnlinkUsuarioFromComite(comiteId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (linkId: string) => apiClient.delete(`/comite/usuario/${linkId}`),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: comiteUsuarioKeys.all(comiteId) });
    },
  });
}

export function useUpdateUsuarioLink(comiteId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & UpdateMembroLinkPayload) => {
      return apiClient.put(`/comite/usuario/${id}`, data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: comiteUsuarioKeys.all(comiteId) });
    },
  });
}
