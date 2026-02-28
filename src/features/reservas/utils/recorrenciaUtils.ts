import { TipoRecorrencia } from '../types';

const MAX_OCORRENCIAS = 365;

function nextOcorrencia(date: Date, tipo: TipoRecorrencia): Date {
  const next = new Date(date);

  switch (tipo) {
    case TipoRecorrencia.DIARIA:
      next.setDate(next.getDate() + 1);
      break;

    case TipoRecorrencia.SEMANAL:
      next.setDate(next.getDate() + 7);
      break;

    case TipoRecorrencia.MENSAL: {
      const originalDay = next.getDate();
      next.setMonth(next.getMonth() + 1);
      if (next.getDate() !== originalDay) {
        next.setDate(0);
      }
      break;
    }
  }

  return next;
}

export function countOcorrencias(
  dataInicio: Date,
  dataFimRecorrencia: Date,
  tipo: TipoRecorrencia,
): number {
  if (tipo === TipoRecorrencia.NAO_REPETE) {
    return 1;
  }

  let count = 1;
  let current = dataInicio;

  while (count <= MAX_OCORRENCIAS) {
    current = nextOcorrencia(current, tipo);
    if (current > dataFimRecorrencia) {
      break;
    }
    count++;
  }

  return count;
}

export function getWeekdayName(date: Date): string {
  return date.toLocaleDateString('pt-BR', { weekday: 'long' });
}

export function buildRecorrenciaSummary(
  dataInicio: Date | undefined,
  dataFimRecorrencia: Date | undefined,
  tipo: TipoRecorrencia,
): string | null {
  if (tipo === TipoRecorrencia.NAO_REPETE) {
    return null;
  }
  if (!dataInicio || !dataFimRecorrencia) {
    return null;
  }
  if (dataFimRecorrencia <= dataInicio) {
    return null;
  }

  const count = countOcorrencias(dataInicio, dataFimRecorrencia, tipo);

  const fimFormatted = dataFimRecorrencia.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const frequency: Record<TipoRecorrencia, string> = {
    [TipoRecorrencia.NAO_REPETE]: '',
    [TipoRecorrencia.DIARIA]: 'todos os dias',
    [TipoRecorrencia.SEMANAL]: `toda ${getWeekdayName(dataInicio)}`,
    [TipoRecorrencia.MENSAL]: `todo dia ${dataInicio.getDate()} de cada mês`,
  };

  const plural = count !== 1 ? 'reservas' : 'reserva';

  return `Isso criará ${count} ${plural}, ${frequency[tipo]}, até ${fimFormatted}.`;
}

export function buildDataFimRecorrenciaISO(
  dataFimRecorrencia: Date,
  dataFim: Date,
): string {
  const combined = new Date(
    dataFimRecorrencia.getFullYear(),
    dataFimRecorrencia.getMonth(),
    dataFimRecorrencia.getDate(),
    dataFim.getHours(),
    dataFim.getMinutes(),
    0,
  );
  return combined.toISOString();
}
