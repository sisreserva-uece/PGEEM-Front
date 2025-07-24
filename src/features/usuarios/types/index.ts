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
