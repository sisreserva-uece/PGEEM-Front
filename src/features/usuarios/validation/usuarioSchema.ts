import { z } from 'zod';

export const updateUsuarioFormSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  fotoPerfil: z.string().url('URL inválida.').optional().or(z.literal('')),
  matricula: z.coerce.number().optional(),
  telefone: z.string().optional(),
  instituicaoId: z.string().uuid('Instituição é obrigatória.'),
  refreshTokenEnabled: z.boolean(),
  cargosId: z.array(z.string()).min(1, 'Selecione pelo menos um cargo.'),
});

export type UsuarioUpdatePayload = z.infer<typeof updateUsuarioFormSchema>;
export type UsuarioFormValues = z.infer<typeof updateUsuarioFormSchema>;
