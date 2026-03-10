'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, LayoutDashboard, Loader2, TrendingUp, Boxes } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDashboardAnalytics } from '../hooks/useDashboardAnalytics';
import { useGetEstatisticas } from '../services/EstatisticasService';
import { useGetTiposEquipamento } from '@/features/equipamentos/services/equipamentoService';
import { useGetTiposEspaco, useGetSelectOptions } from '@/features/espacos/services/espacoService';
import { DashboardHeader } from '../components/DashboardHeader';
import { DashboardFilters } from '../components/DashboardFilters';
import { DashboardKPIs } from '../components/DashboardKPIs';
import { DashboardRanking } from '../components/DashboardRanking';
import { DashboardInsightsFooter } from '../components/DashboardInsightsFooter';
import { GraficoBarras } from './GraficoBarras';


import { dashboardFilterSchema, DashboardFilterValues } from '../validation/relatorioSchema';

export function RelatorioDashboard({ isOpen, onOpenChange, tipo, idsSelecionados }: any) {
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = useState(false);

  const { data: tiposEquipamentoData } = useGetTiposEquipamento({ todos: true });
  const tiposEquipamento = Array.isArray(tiposEquipamentoData) ? tiposEquipamentoData : tiposEquipamentoData?.content || [];
  const { data: departamentos } = useGetSelectOptions('configuracao/departamento', 'departamentos');
  const { data: localizacoes } = useGetSelectOptions('configuracao/localizacao', 'localizacoes');

  const hoje = new Date();
  const form = useForm<DashboardFilterValues>({
    resolver: zodResolver(dashboardFilterSchema),
    defaultValues: {
      mesInicial: "01",
      anoInicial: (hoje.getFullYear() - 2).toString(),
      mesFinal: (hoje.getMonth() + 1).toString().padStart(2, '0'),
      anoFinal: hoje.getFullYear().toString(),
      multiusuario: false,
      tipoEquipamentoId: 'all',
      departamentoId: 'all',
      localizacaoId: 'all'
    }
  });

  const filtrosAtuais = form.watch();
  const { data, isLoading, isFetching } = useGetEstatisticas(filtrosAtuais, tipo, idsSelecionados, isOpen);
  const stats = tipo === 'espacos' ? data?.espacos?.[0] : data?.equipamentos?.[0];

  const { insights, usuariosFiltrados } = useDashboardAnalytics(stats, searchTerm);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-none !w-screen !h-screen !rounded-none !p-0 !m-0 flex flex-col border-none outline-none z-[100] bg-[#F8FAFC]">
        
        <div className="sr-only">
          <DialogTitle>
            Dashboard Analítico de {tipo === 'espacos' ? 'Espaços' : 'Equipamentos'}
          </DialogTitle>
          <DialogDescription>
            Visualização detalhada de estatísticas de uso para os itens selecionados.
          </DialogDescription>
        </div>

        <DashboardHeader tipo={tipo} isFetching={isFetching} insights={insights} stats={stats} onClose={() => onOpenChange(false)} />

        <DashboardFilters form={form} tipo={tipo} departamentos={departamentos} localizacoes={localizacoes} tiposEquipamento={tiposEquipamento} />

        <div className="h-[3px] w-full bg-transparent overflow-hidden relative">
          {isFetching && <div className="absolute inset-0 bg-[#10B981] animate-pulse origin-left shadow-[0_0_10px_#10B981]" />}
        </div>

        <main className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="max-w-[1750px] mx-auto space-y-10 pb-20">
            
            <DashboardKPIs stats={stats} insights={insights} idsCount={idsSelecionados.length} />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
              <div className="xl:col-span-8 bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col min-h-[650px]">
                <div className="mb-12">
                  <h3 className="text-lg font-black text-slate-800 uppercase flex items-center gap-3"><TrendingUp className="h-6 w-6 text-[#10B981]" /> Evolução e Tendência</h3>
                </div>
                <div className="flex-1">
                  {isLoading ? <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-emerald-500" /></div> : <GraficoBarras data={stats?.estatisticasPorMes || []} />}
                </div>
              </div>

              <DashboardRanking usuarios={usuariosFiltrados} searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            </div>

            <DashboardInsightsFooter stats={stats} insights={insights} tipo={tipo} />
          </div>
        </main>
      </DialogContent>
    </Dialog>
  );
}