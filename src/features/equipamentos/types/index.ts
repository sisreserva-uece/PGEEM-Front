import type { Espaco } from '@/features/espacos/types';

export enum EquipamentoStatus {
  INATIVO = 0,
  ATIVO = 1,
  EM_MANUTENCAO = 2,
}

export type TipoEquipamento = {
  id: string;
  nome: string;
  isDetalhamentoObrigatorio: boolean;
};

export type Equipamento = {
  id: string;
  tombamento: string;
  descricao: string | null;
  status: EquipamentoStatus;
  tipoEquipamento: TipoEquipamento;
};

export type EquipamentoEspacoLink = {
  id: string;
  dataAlocacao: string;
  dataRemocao: string | null;
  equipamento: Equipamento;
  espaco: Espaco;
};
