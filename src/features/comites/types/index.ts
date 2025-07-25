import type { Usuario } from '@/features/usuarios/types';
import type { ApiSelectOption } from '@/types/api';

export enum ComiteTipo {
  GESTOR = 0,
  USUARIOS = 1,
  TECNICOS = 2,
  REPRESENTANTE_DISCENTE = 3,
}

export const ComiteTipoMap: Record<ComiteTipo, string> = {
  [ComiteTipo.GESTOR]: 'Gestor',
  [ComiteTipo.USUARIOS]: 'Usuários',
  [ComiteTipo.TECNICOS]: 'Técnicos',
  [ComiteTipo.REPRESENTANTE_DISCENTE]: 'Representante Discente',
};

export type Comite = {
  id: string;
  descricao: string;
  tipo: ComiteTipo;
};

export type ComiteUsuarioLink = {
  id: string;
  comite: Comite;
  usuario: Usuario;
  departamento: ApiSelectOption | null;
  descricao: string | null;
  portaria: string;
  isTitular: boolean;
};
