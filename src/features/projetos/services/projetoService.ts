import type { Projeto } from '../types';
import type { ProjetoCreatePayload } from '../validation/projetoSchema';
import { createCrudHooks } from '@/lib/hooks/useCrud';

export const {
  useGet: useGetProjetos,
  useCreate: useCreateProjeto,
} = createCrudHooks<Projeto, ProjetoCreatePayload>('projeto');
