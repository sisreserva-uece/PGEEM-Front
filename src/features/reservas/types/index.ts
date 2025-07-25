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

export type Reserva = {
  id: string;
  dataInicio: string; // ISO DateTime string
  dataFim: string; // ISO DateTime string
  status: ReservaStatus;
  espacoId: string;
  usuarioSolicitanteId: string;
  projetoId: string | null;
};
