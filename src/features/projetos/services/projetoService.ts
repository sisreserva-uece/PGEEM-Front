import type { Projeto } from '../types';
import type { ProjetoCreatePayload } from '../validation/projetoSchema';
import { createCrudHooks } from '@/lib/hooks/useCrud';

export const {
  useGet: useGetProjetos,
  useCreate: useCreateProjeto,
  useGetById: useGetProjetoById,
} = createCrudHooks<Projeto, ProjetoCreatePayload>('projeto');
