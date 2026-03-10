import { z } from 'zod';

/**
 * Schema for catalog CRUD operations (Concern A).
 *
 * Intentionally minimal — the catalog entity only carries a name.
 * The min/max bounds are practical UI constraints, not backend-derived.
 * Adjust if the backend enforces different limits.
 */
export const equipamentoGenericoSchema = z.object({
  nome: z
    .string({ required_error: 'O nome é obrigatório.' })
    .min(2, 'O nome deve ter pelo menos 2 caracteres.')
    .max(100, 'O nome deve ter no máximo 100 caracteres.')
    .trim(),
});

// ---------------------------------------------------------------------------
// Inferred payload types — import these wherever the payload shape is needed.
// Do NOT duplicate these in types/index.ts.
// ---------------------------------------------------------------------------

export type EquipamentoGenericoCreatePayload = z.infer<typeof equipamentoGenericoSchema>;

/**
 * Structurally identical to create, but kept as a separate named type
 * to allow independent evolution and to be explicit at call sites.
 */
export type EquipamentoGenericoUpdatePayload = z.infer<typeof equipamentoGenericoSchema>;
