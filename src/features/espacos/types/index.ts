import type { Equipamento } from '@/features/equipamentos/types';
import type { Usuario } from '@/features/usuarios/types';
import type { ApiSelectOption } from '@/types/api';

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

export type EspacoGestorLink = {
  id: string;
  espaco: Espaco;
  gestor: Usuario;
  estaAtivo: boolean;
};

export type EquipamentoEspacoLink = {
  id: string;
  equipamento: Equipamento;
  espaco: Espaco;
  dataAlocacao: string;
  dataRemocao: string | null;
};
