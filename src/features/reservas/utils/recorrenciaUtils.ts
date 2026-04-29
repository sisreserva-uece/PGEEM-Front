import { ModoRecorrenciaMensal, TipoRecorrencia } from '../types';

const MAX_OCORRENCIAS = 365;

function nextSameDayOfWeekOfMonth(date: Date): number {
  const dayOfWeek = date.getDay();
  const ordinal = Math.ceil(date.getDate() / 7);

  const targetMonth = date.getMonth() + 1;
  const targetYear = date.getMonth() === 11 ? date.getFullYear() + 1 : date.getFullYear();

  const occurrences: number[] = [];
  const probe = new Date(targetYear, targetMonth, 1);
  while (probe.getMonth() === targetMonth) {
    if (probe.getDay() === dayOfWeek) {
      occurrences.push(probe.getDate());
    }
    probe.setDate(probe.getDate() + 1);
  }

  return occurrences[Math.min(ordinal, occurrences.length) - 1];
}

function nextOcorrencia(
  date: Date,
  tipo: TipoRecorrencia,
  modoMensal: ModoRecorrenciaMensal = ModoRecorrenciaMensal.DIA_DO_MES,
): Date {
  const next = new Date(date);

  switch (tipo) {
    case TipoRecorrencia.DIARIA:
      next.setDate(next.getDate() + 1);
      break;

    case TipoRecorrencia.SEMANAL:
      next.setDate(next.getDate() + 7);
      break;

    case TipoRecorrencia.A_CADA_DUAS_SEMANAS:
      next.setDate(next.getDate() + 14);
      break;

    case TipoRecorrencia.A_CADA_TRES_SEMANAS:
      next.setDate(next.getDate() + 21);
      break;

    case TipoRecorrencia.A_CADA_QUATRO_SEMANAS:
      next.setDate(next.getDate() + 28);
      break;

    case TipoRecorrencia.MENSAL:
      if (modoMensal === ModoRecorrenciaMensal.DIA_DA_SEMANA_DO_MES) {
        next.setDate(nextSameDayOfWeekOfMonth(date));
        next.setMonth(date.getMonth() + 1);
      } else {
        const originalDay = next.getDate();
        next.setMonth(next.getMonth() + 1);
        if (next.getDate() !== originalDay) {
          next.setDate(0);
        }
      }
      break;
  }

  return next;
}

export function countOcorrencias(
  dataInicio: Date,
  dataFimRecorrencia: Date,
  tipo: TipoRecorrencia,
  modoMensal: ModoRecorrenciaMensal = ModoRecorrenciaMensal.DIA_DO_MES,
): number {
  if (tipo === TipoRecorrencia.NAO_REPETE) {
    return 1;
  }

  let count = 1;
  let current = dataInicio;

  while (count <= MAX_OCORRENCIAS) {
    current = nextOcorrencia(current, tipo, modoMensal);
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
  modoMensal: ModoRecorrenciaMensal = ModoRecorrenciaMensal.DIA_DO_MES,
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

  const count = countOcorrencias(dataInicio, dataFimRecorrencia, tipo, modoMensal);
  const fimFormatted = dataFimRecorrencia.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const mensalLabel = modoMensal === ModoRecorrenciaMensal.DIA_DA_SEMANA_DO_MES
    ? `toda ${getOrdinalWeekdayLabel(dataInicio)}`
    : `todo dia ${dataInicio.getDate()} de cada mês`;

  const frequency: Record<TipoRecorrencia, string> = {
    [TipoRecorrencia.NAO_REPETE]: '',
    [TipoRecorrencia.DIARIA]: 'todos os dias',
    [TipoRecorrencia.SEMANAL]: `toda ${getWeekdayName(dataInicio)}`,
    [TipoRecorrencia.MENSAL]: mensalLabel,
    [TipoRecorrencia.A_CADA_DUAS_SEMANAS]: `a cada 2 semanas (${getWeekdayName(dataInicio)})`,
    [TipoRecorrencia.A_CADA_TRES_SEMANAS]: `a cada 3 semanas (${getWeekdayName(dataInicio)})`,
    [TipoRecorrencia.A_CADA_QUATRO_SEMANAS]: `a cada 4 semanas (${getWeekdayName(dataInicio)})`,
  };

  const plural = count !== 1 ? 'reservas' : 'reserva';
  return `Isso criará ${count} ${plural}, ${frequency[tipo]}, até ${fimFormatted}.`;
}

function getOrdinalWeekdayLabel(date: Date): string {
  const ordinals = ['primeira', 'segunda', 'terceira', 'quarta', 'quinta'];
  const ordinal = Math.ceil(date.getDate() / 7);
  const weekday = getWeekdayName(date);
  return `${ordinals[ordinal - 1] ?? `${ordinal}ª`} ${weekday} do mês`;
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
