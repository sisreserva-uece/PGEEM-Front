'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Loader2, TrendingUp } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDashboardAnalytics } from '../hooks/useDashboardAnalytics';
import { useGetEstatisticas } from '../services/EstatisticasService';
import { useGetTiposEquipamento } from '@/features/equipamentos/services/equipamentoService';
import { useGetSelectOptions } from '@/features/espacos/services/espacoService';
import { useUserAccess } from '@/features/auth/hooks/useUserAccess';
import { DashboardHeader } from '../components/DashboardHeader';
import { DashboardFilters } from '../components/DashboardFilters';
import { DashboardKPIs } from '../components/DashboardKPIs';
import { DashboardRanking } from '../components/DashboardRanking';
import { DashboardInsightsFooter } from '../components/DashboardInsightsFooter';
import { GraficoBarras } from './GraficoBarras';
import { dashboardFilterSchema, DashboardFilterValues } from '../validation/relatorioSchema';

export default function RelatorioDashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="h-10 w-10 animate-spin text-[#10B981]" />
      </div>
    );
  }

  return <RelatorioDashboardContent />;
}

function RelatorioDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const access = useUserAccess(); 
  const [searchTerm, setSearchTerm] = useState('');

  const tipo = (searchParams.get('tipo') as 'espacos' | 'equipamentos') || 'espacos';
  const idsRaw = searchParams.get('ids') || '';
  const idsSelecionados = useMemo(() => idsRaw.split(',').filter(Boolean), [idsRaw]);


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

  const hasValidIds = useMemo(() => {
    return idsSelecionados.length > 0 && 
           !idsSelecionados.includes('all') &&
           idsSelecionados.every(id => id && id !== 'undefined' && id !== 'null');
  }, [idsSelecionados]);

  const filtrosAtuais = form.watch();
  
  const canFetch = hasValidIds && !access.isLoading && access.isAdmin;

  const { data: tiposEquipamentoData } = useGetTiposEquipamento(
    canFetch ? { todos: true } : { todos: false }
  );
  const tiposEquipamento = Array.isArray(tiposEquipamentoData) 
    ? tiposEquipamentoData 
    : (tiposEquipamentoData as any)?.content || [];

  const { data: departamentos } = useGetSelectOptions(
    canFetch ? 'departamento' : '', 
    'departamentos'
  );
  
  const { data: localizacoes } = useGetSelectOptions(
    canFetch ? '/localizacao' : '', 
    'localizacoes'
  );

  const { data, isLoading, isFetching } = useGetEstatisticas(
    filtrosAtuais, 
    tipo, 
    idsSelecionados, 
    !!canFetch
  );

  const stats = useMemo(() => {
    if (!data) return null;
    const source = tipo === 'espacos' ? (data as any)?.espacos : (data as any)?.equipamentos;
    return source?.[0] || null;
  }, [data, tipo]);

  const { insights, usuariosFiltrados } = useDashboardAnalytics(stats, searchTerm);

  useEffect(() => {
    if (!access.isLoading && !access.isAdmin) {
      router.push('/dashboard');
    }
  }, [access.isAdmin, access.isLoading, router]);

  if (access.isLoading || !access.isAdmin) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="h-10 w-10 animate-spin text-[#10B981]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-[#F8FAFC] overflow-hidden">
        <DashboardHeader 
          tipo={tipo} 
          isFetching={isFetching} 
          insights={insights} 
          stats={stats} 
          onClose={() => router.back()} 
        />

        <DashboardFilters 
          form={form} 
          tipo={tipo} 
          departamentos={departamentos} 
          localizacoes={localizacoes} 
          tiposEquipamento={tiposEquipamento} 
        />

        <main id="dashboard-content" className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="max-w-[1750px] mx-auto space-y-10 pb-20">
            {!stats && isLoading ? (
              <div className="h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin mb-4 text-[#10B981]" />
                <p className="font-black uppercase tracking-widest text-xs text-slate-400">Sincronizando dados...</p>
              </div>
            ) : (
              <>
                <DashboardKPIs stats={stats} insights={insights} idsCount={idsSelecionados.length} />
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                  <div className="xl:col-span-8 bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col min-h-[650px]">
                    <div className="mb-12">
                      <h3 className="text-lg font-black text-slate-800 uppercase flex items-center gap-3">
                        <TrendingUp className="h-6 w-6 text-[#10B981]" /> Evolução e Tendência
                      </h3>
                    </div>
                    <div className="flex-1">
                      {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                          <Loader2 className="animate-spin text-emerald-500" />
                        </div>
                      ) : (
                        <GraficoBarras data={stats?.estatisticasPorMes || []} />
                      )}
                    </div>
                  </div>
                  <DashboardRanking 
                    usuarios={usuariosFiltrados} 
                    searchTerm={searchTerm} 
                    onSearchChange={setSearchTerm} 
                  />
                </div>
                <DashboardInsightsFooter stats={stats} insights={insights} tipo={tipo} />
              </>
            )}
          </div>
        </main>
    </div>
  );
}