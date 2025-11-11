import { z } from 'zod';

export const complexoFormSchema = z.object({
  nome: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }).max(100),
  descricao: z.string().max(500, { message: 'A descrição não pode ter mais de 500 caracteres.' }).optional().or(z.literal('')),
  site: z.string().url({ message: 'Por favor, insira uma URL válida.' }).optional().or(z.literal('')),
});

export type ComplexoCreatePayload = z.infer<typeof complexoFormSchema>;
export type ComplexoUpdatePayload = Partial<ComplexoCreatePayload>;
