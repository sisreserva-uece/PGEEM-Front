import { z } from 'zod';

export const equipamentoGenericoEspacoCreateSchema = z.object({
  equipamentoGenericoId: z
    .string({ required_error: 'Selecione um equipamento genérico.' })
    .min(1, 'Selecione um equipamento genérico.'),

  espacoId: z
    .string({ required_error: 'O espaço é obrigatório.' })
    .min(1, 'O espaço é obrigatório.'),

  quantidade: z
    .number({
      required_error: 'A quantidade é obrigatória.',
      invalid_type_error: 'A quantidade deve ser um número.',
    })
    .int('A quantidade deve ser um número inteiro.')
    .min(1, 'A quantidade mínima é 1.'),
});

export const atualizarQuantidadeSchema = z.object({
  quantidade: z
    .number({
      required_error: 'A quantidade é obrigatória.',
      invalid_type_error: 'A quantidade deve ser um número.',
    })
    .int('A quantidade deve ser um número inteiro.')
    .min(1, 'A quantidade mínima é 1.'),
});

export type EquipamentoGenericoEspacoCreatePayload = z.infer<typeof equipamentoGenericoEspacoCreateSchema>;
export type AtualizarQuantidadePayload = z.infer<typeof atualizarQuantidadeSchema>;
