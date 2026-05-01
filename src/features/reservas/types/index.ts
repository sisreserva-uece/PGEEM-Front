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
  A_CADA_DUAS_SEMANAS = 4,
  A_CADA_TRES_SEMANAS = 5,
  A_CADA_QUATRO_SEMANAS = 6,
}

export const TipoRecorrenciaMap: Record<TipoRecorrencia, string> = {
  [TipoRecorrencia.NAO_REPETE]: 'Não se repete',
  [TipoRecorrencia.DIARIA]: 'Diária',
  [TipoRecorrencia.SEMANAL]: 'Semanal',
  [TipoRecorrencia.MENSAL]: 'Mensal',
  [TipoRecorrencia.A_CADA_DUAS_SEMANAS]: 'A cada 2 semanas',
  [TipoRecorrencia.A_CADA_TRES_SEMANAS]: 'A cada 3 semanas',
  [TipoRecorrencia.A_CADA_QUATRO_SEMANAS]: 'A cada 4 semanas',
};

export enum ModoRecorrenciaMensal {
  DIA_DO_MES = 0,
  DIA_DA_SEMANA_DO_MES = 1,
}

export const ModoRecorrenciaMensalMap: Record<ModoRecorrenciaMensal, string> = {
  [ModoRecorrenciaMensal.DIA_DO_MES]: 'Mesmo dia do mês',
  [ModoRecorrenciaMensal.DIA_DA_SEMANA_DO_MES]: 'Mesmo dia da semana do mês',
};

export type OcorrenciaReserva = {
  serieId: string;
  dataOcorrencia: string;
  dataInicio: string;
  dataFim: string;
  status: ReservaStatus;
  temExcecao: boolean;
  excecaoId: string | null;
  motivo: string | null;
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
  modoRecorrenciaMensal?: ModoRecorrenciaMensal | null;
  dataFimRecorrencia?: string | null;
  isSerie?: boolean;
  ocorrenciasMes?: OcorrenciaReserva[] | null;
  reservaPaiId?: string | null;
};

export type ReservableResourceType = 'espaco' | 'equipamento';

export type ReservableResource = {
  id: string;
  type: ReservableResourceType;
  displayName: string;
  requiresProject: boolean;
};
