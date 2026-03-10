import { Award, Percent, Activity, Calendar, AlertTriangle, CheckCircle2, Users2, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DashboardInsightsFooter({ stats, insights, tipo }: any) {
  const hasData = stats?.totaisPeriodo?.totalReservasSolicitadas > 0;
  const isHighFidelity = (insights?.indiceFidelidade || 0) > 50;
  const isHighConversion = (insights?.taxaAprovacao || 0) > 80;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
      
      <div className={cn(
        "p-8 rounded-[2rem] transition-all duration-500 flex items-center justify-between group shadow-xl",
        hasData ? "bg-emerald-500 text-white shadow-emerald-100" : "bg-slate-100 text-slate-400 shadow-none border-2 border-dashed border-slate-200"
      )}>
        <div className="space-y-2">
          <h4 className="text-[10px] font-black uppercase opacity-80 tracking-[0.2em]">
            {hasData ? "Análise de Sazonalidade" : "Aguardando Dados"}
          </h4>
          
          {hasData ? (
            <>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-black">{insights?.mesPicoNome}</p>
                <p className="text-xl font-bold opacity-60">/{insights?.mesPico?.ano}</p>
              </div>
              <p className="text-xs font-medium opacity-90 leading-relaxed max-w-[280px]">
                Este foi o seu **período de ouro**. Houve um pico de <span className="underline decoration-2 underline-offset-4">{insights?.mesPico?.reservasConfirmadas} confirmadas</span>, sugerindo alta demanda acadêmica.
              </p>
            </>
          ) : (
            <div className="py-2">
              <p className="text-xl font-black italic">Sem picos de uso</p>
              <p className="text-[10px] uppercase font-bold tracking-tight">O histórico está limpo no período selecionado.</p>
            </div>
          )}
        </div>
        {hasData ? (
          <TrendingUp className="h-16 w-16 opacity-20 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500" />
        ) : (
          <Calendar className="h-16 w-16 opacity-10" />
        )}
      </div>

      <div className={cn(
        "p-8 rounded-[2rem] border-2 transition-all duration-500 flex items-center justify-between group bg-white",
        hasData ? (isHighFidelity ? "border-amber-200 shadow-lg shadow-amber-50" : "border-blue-100 shadow-lg shadow-blue-50") : "border-dashed border-slate-200"
      )}>
        <div className="space-y-2">
          <h4 className={cn(
            "text-[10px] font-black uppercase tracking-[0.2em]",
            hasData ? (isHighFidelity ? "text-amber-500" : "text-blue-500") : "text-slate-400"
          )}>
            {isHighFidelity ? "Alerta de Monopólio" : "Distribuição de Uso"}
          </h4>
          
          {hasData ? (
            <>
              <p className={cn("text-4xl font-black tracking-tighter", isHighFidelity ? "text-amber-600" : "text-blue-600")}>
                {insights?.indiceFidelidade}%
              </p>
              <p className="text-xs font-bold text-slate-500 leading-relaxed max-w-[280px]">
                {isHighFidelity 
                  ? `Cuidado: **${insights?.topUser?.usuarioNome}** concentra mais da metade do uso. Considere democratizar o acesso.` 
                  : `Excelente! O uso do ${tipo === 'espacos' ? 'espaço' : 'equipamento'} está bem distribuído entre os pesquisadores.`}
              </p>
            </>
          ) : (
            <div className="py-2">
              <p className="text-xl font-black text-slate-400 italic">Análise Pendente</p>
              <p className="text-[10px] font-bold text-slate-300 uppercase">Aguardando reservas para traçar perfil de uso.</p>
            </div>
          )}
        </div>
        <div className={cn(
          "h-16 w-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
          hasData ? (isHighFidelity ? "bg-amber-50 text-amber-500" : "bg-blue-50 text-blue-500") : "bg-slate-50 text-slate-200"
        )}>
          {isHighFidelity ? <AlertTriangle size={32} /> : <Users2 size={32} />}
        </div>
      </div>

    </div>
  );
}