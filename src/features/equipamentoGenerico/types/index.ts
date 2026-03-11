import type { Espaco } from '@/features/espacos/types';

export type { AtualizarQuantidadePayload, EquipamentoGenericoEspacoCreatePayload } from '../validation/equipamentoGenericoEspacoSchema';
export type { EquipamentoGenericoCreatePayload, EquipamentoGenericoUpdatePayload } from '../validation/equipamentoGenericoSchema';

export type EquipamentoGenerico = {
  id: string;
  nome: string;
};

export type EquipamentoGenericoEspaco = {
  id: string;
  equipamentoGenerico: EquipamentoGenerico;
  espaco: Pick<Espaco, 'id' | 'nome'>;
  quantidade: number;
};
