// features/equipamentoGenerico/validation/equipamentoGenericoEspacoSchema.ts

import { z } from 'zod';

/**
 * Schema for creating an allocation (Concern B).
 *
 * `espacoId` is included in the schema because it is required by the backend,
 * but it will typically be injected by the parent context (the space detail
 * view) as a default value — not rendered as a visible form field.
 * This keeps the schema as the single source of truth for the full payload
 * shape, while the form surface stays minimal.
 */
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

/**
 * Schema for updating the quantity of an existing allocation.
 *
 * Intentionally asymmetric from the create schema — the backend exposes
 * quantity updates as a dedicated, narrow operation. The binding itself
 * (which item, which space) is immutable after creation.
 */
export const atualizarQuantidadeSchema = z.object({
  quantidade: z
    .number({
      required_error: 'A quantidade é obrigatória.',
      invalid_type_error: 'A quantidade deve ser um número.',
    })
    .int('A quantidade deve ser um número inteiro.')
    .min(1, 'A quantidade mínima é 1.'),
});

// ---------------------------------------------------------------------------
// Inferred payload types
// ---------------------------------------------------------------------------

export type EquipamentoGenericoEspacoCreatePayload = z.infer<typeof equipamentoGenericoEspacoCreateSchema>;
export type AtualizarQuantidadePayload = z.infer<typeof atualizarQuantidadeSchema>;
