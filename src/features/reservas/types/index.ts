export enum ReservaStatus {
  PENDENTE = 0,
  APROVADO = 1,
  RECUSADO = 2,
  PENDENTE_AJUSTE = 3,
}

export const ReservaStatusMap: Record<ReservaStatus, { label: string; className: string }> = {
  [ReservaStatus.PENDENTE]: { label: 'Pendente', className: 'bg-yellow-500' },
  [ReservaStatus.APROVADO]: { label: 'Aprovado', className: 'bg-green-500' },
  [ReservaStatus.RECUSADO]: { label: 'Recusado', className: 'bg-red-500' },
  [ReservaStatus.PENDENTE_AJUSTE]: { label: 'Pendente de Ajuste', className: 'bg-orange-500' },
};

export enum TipoRecorrencia {
  NAO_REPETE = 0,
  DIARIA = 1,
  SEMANAL = 2,
  MENSAL = 3,
}

export const TipoRecorrenciaMap: Record<TipoRecorrencia, string> = {
  [TipoRecorrencia.NAO_REPETE]: 'Não se repete',
  [TipoRecorrencia.DIARIA]: 'Diária',
  [TipoRecorrencia.SEMANAL]: 'Semanal',
  [TipoRecorrencia.MENSAL]: 'Mensal',
};

export type Reserva = {
  id: string;
  dataInicio: string;
  dataFim: string;
  status: ReservaStatus;
  espacoId?: string;
  equipamentoId?: string;
  usuarioSolicitanteId: string;
  projetoId: string | null;
  tipoRecorrencia?: TipoRecorrencia;
  reservaPaiId?: string | null;
};

export type ReservableResourceType = 'espaco' | 'equipamento';

export type ReservableResource = {
  id: string;
  type: ReservableResourceType;
  displayName: string;
  requiresProject: boolean;
};
