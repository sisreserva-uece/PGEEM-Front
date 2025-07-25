import { z } from 'zod';
import { ComiteTipo } from '../types';

export const comiteFormSchema = z.object({
  descricao: z.string().min(3, { message: 'A descrição deve ter pelo menos 3 caracteres.' }),
  tipo: z.nativeEnum(ComiteTipo, { errorMap: () => ({ message: 'O tipo é obrigatório.' }) }),
});

export const comiteUpdateSchema = comiteFormSchema.pick({
  descricao: true,
});

export const linkMembroFormSchema = z.object({
  usuarioId: z.string().min(1, 'É obrigatório selecionar um usuário.'),
  departamentoId: z.string().uuid('O departamento é inválido.').optional().or(z.literal('')),
  portaria: z.string().min(1, 'A portaria é obrigatória.').max(50),
  descricao: z.string().max(100).optional(),
  isTitular: z.boolean(),
});

export const updateMembroLinkSchema = linkMembroFormSchema.pick({
  departamentoId: true,
  descricao: true,
  isTitular: true,
});

export type ComiteFormValues = z.infer<typeof comiteFormSchema>;
export type ComiteCreatePayload = z.infer<typeof comiteFormSchema>;
export type ComiteUpdatePayload = z.infer<typeof comiteUpdateSchema>;
export type LinkMembroFormValues = z.infer<typeof linkMembroFormSchema>;
export type LinkMembroCreatePayload = z.infer<typeof linkMembroFormSchema> & { comiteId: string };
export type UpdateMembroLinkPayload = z.infer<typeof updateMembroLinkSchema>;
