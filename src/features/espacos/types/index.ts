export type ApiSelectOption = {
  id: string;
  nome: string;
};

export type Espaco = {
  id: string;
  nome: string;
  urlCnpq: string | null;
  observacao: string | null;
  precisaProjeto: boolean;
  departamento: ApiSelectOption;
  localizacao: ApiSelectOption;
  tipoEspaco: ApiSelectOption;
  tipoAtividade: ApiSelectOption;
};

export type Cargo = {
  id: string;
  nome: string;
  descricao: string;
};

export type Usuario = {
  id: string;
  nome: string;
  email: string;
  cargos: Cargo[];
};

export type EspacoGestorLink = {
  id: string;
  espaco: Espaco;
  gestor: Usuario;
  estaAtivo: boolean;
};

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
  tombamento: string | null;
  descricao: string;
  status: EquipamentoStatus;
  tipoEquipamento: TipoEquipamento;
};

export type EquipamentoEspacoLink = {
  id: string;
  equipamento: Equipamento;
  espaco: Espaco;
  dataAlocacao: string;
  dataRemocao: string | null;
};
