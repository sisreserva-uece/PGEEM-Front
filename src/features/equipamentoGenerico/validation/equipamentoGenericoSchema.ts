import { z } from 'zod';

export const equipamentoGenericoSchema = z.object({
  nome: z
    .string({ required_error: 'O nome é obrigatório.' })
    .min(2, 'O nome deve ter pelo menos 2 caracteres.')
    .max(100, 'O nome deve ter no máximo 100 caracteres.')
    .trim(),
});

export type EquipamentoGenericoCreatePayload = z.infer<typeof equipamentoGenericoSchema>;

export type EquipamentoGenericoUpdatePayload = z.infer<typeof equipamentoGenericoSchema>;
