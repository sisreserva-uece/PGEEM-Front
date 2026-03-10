// features/equipamentoGenerico/types/index.ts

import type { Espaco } from '@/features/espacos/types';

export type { AtualizarQuantidadePayload, EquipamentoGenericoEspacoCreatePayload } from '../validation/equipamentoGenericoEspacoSchema';
// Payload types live in the validation schemas — import them from there.
// Re-exported here purely as a convenience so consumers have a single
// import point if they need both entity and payload shapes together.
export type { EquipamentoGenericoCreatePayload, EquipamentoGenericoUpdatePayload } from '../validation/equipamentoGenericoSchema';

// ---------------------------------------------------------------------------
// Concern A — Catalog entity
// ---------------------------------------------------------------------------

export type EquipamentoGenerico = {
  id: string;
  nome: string;
};

// ---------------------------------------------------------------------------
// Concern B — Allocation entity
// ---------------------------------------------------------------------------

export type EquipamentoGenericoEspaco = {
  id: string;
  equipamentoGenerico: EquipamentoGenerico;
  espaco: Pick<Espaco, 'id' | 'nome'>;
  quantidade: number;
};
