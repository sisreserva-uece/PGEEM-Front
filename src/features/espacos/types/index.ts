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
