import type { ApiSelectOption } from '@/types/api';

export type Cargo = {
  id: string;
  nome: string;
  descricao: string;
};

export type Usuario = {
  id: string;
  nome: string;
  email: string;
  matricula?: number;
  documentoFiscal: string;
  fotoPerfil?: string;
  telefone?: string;
  instituicao: ApiSelectOption;
  refreshTokenEnabled: boolean;
  cargos: Cargo[];
};
