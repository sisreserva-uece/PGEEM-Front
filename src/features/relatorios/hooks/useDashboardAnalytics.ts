import { useMemo } from 'react';
import { meses } from '../validation/relatorioSchema';

export function useDashboardAnalytics(stats: any, searchTerm: string) {
  const insights = useMemo(() => {
    if (!stats) return null;

    const mesPico = stats.mesComMaisReservas;
    const mesPicoNome = meses.find(m => parseInt(m.v) === mesPico?.mes)?.l || 'N/A';
    const topUser = stats.usuariosQueMaisReservaram?.[0];
    const totalSolicitadas = stats.totaisPeriodo?.totalReservasSolicitadas || 0;
    const totalAprovadas = stats.totaisPeriodo?.totalReservasAprovadas || 0;
    
    const taxaRejeicao = totalSolicitadas > 0 
      ? Math.round(((totalSolicitadas - totalAprovadas) / totalSolicitadas) * 100) 
      : 0;
    
    const mediaMensal = totalAprovadas > 0 
      ? (totalAprovadas / (stats.estatisticasPorMes?.length || 1)).toFixed(1) 
      : 0;
    
    const indiceFidelidade = totalAprovadas > 0 && topUser 
      ? Math.round((topUser.reservasConfirmadas / totalAprovadas) * 100) 
      : 0;

    return { mesPicoNome, mesPico, topUser, taxaRejeicao, mediaMensal, indiceFidelidade };
  }, [stats]);

  const usuariosFiltrados = useMemo(() => {
    const lista = stats?.todosUsuarios || stats?.usuariosQueMaisReservaram || [];
    const filtrados = searchTerm 
      ? lista.filter((u: any) => u.usuarioNome.toLowerCase().includes(searchTerm.toLowerCase()))
      : lista;
    
    return filtrados.map((u: any) => ({
      ...u,
      taxaAprovacao: u.reservasSolicitadas > 0 ? Math.round((u.reservasConfirmadas / u.reservasSolicitadas) * 100) : 0
    }));
  }, [stats, searchTerm]);

  return { insights, usuariosFiltrados };
}