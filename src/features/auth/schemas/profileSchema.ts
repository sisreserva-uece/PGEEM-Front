import { z } from 'zod';

export const profileFormSchema = z.object({
  nome: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  email: z.string().email({ message: 'E-mail inválido.' }),
  matricula: z.string().min(1, { message: 'A matrícula é obrigatória.' }),
  telefone: z.string().min(10, { message: 'Telefone inválido.' }),
  instituicaoId: z.string().uuid({ message: 'Selecione uma instituição válida.' }),
  cargosId: z.array(z.string()).min(1, { message: 'Selecione ao menos um cargo.' }),
  fotoPerfil: z.string().optional().or(z.literal('')),
  senha: z.string().optional().or(z.literal('')),
});

export const profileUpdatePayloadSchema = profileFormSchema;

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
export type ProfileUpdatePayload = z.infer<typeof profileUpdatePayloadSchema>;