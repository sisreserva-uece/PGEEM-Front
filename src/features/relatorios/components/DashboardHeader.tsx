import { ArrowLeft, LayoutDashboard, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function DashboardHeader({ tipo, isFetching, insights, stats, onClose }: any) {
  const totalSolicitadas = stats?.totaisPeriodo?.totalReservasSolicitadas || 0;

  return (
    <header className="h-[75px] px-10 border-b bg-white flex items-center justify-between shrink-0 z-30 shadow-sm">
      <div className="flex items-center gap-5">
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-11 w-11"><ArrowLeft className="h-6 w-6" /></Button>
        <div className="h-10 w-[1px] bg-slate-200" />
        <div>
          <h1 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Power Analytics Pro</h1>
          <div className="flex items-center gap-2 mt-1">
            <div className={cn("h-2 w-2 rounded-full", isFetching ? "bg-amber-500 animate-ping" : "bg-emerald-500")} />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {isFetching ? 'Atualizando Dados...' : `Monitorando ${tipo}`}
            </span>
          </div>
        </div>
      </div>

      {insights && (
        <div className="hidden lg:flex items-center gap-6 px-6 py-2 bg-slate-50 border rounded-2xl">
          <InsightItem label="Mês Pico" value={totalSolicitadas > 0 ? `${insights.mesPicoNome} / ${insights.mesPico?.ano}` : "Sem registros"} color="text-emerald-600" />
          <InsightItem label="Fidelidade" value={totalSolicitadas > 0 ? `${insights.indiceFidelidade}%` : "0%"} color="text-blue-600" />
          <InsightItem label="Top Utilizador" value={totalSolicitadas > 0 ? (insights.topUser?.usuarioNome || '---') : 'Nenhum'} color="text-slate-700" />
        </div>
      )}
      <Button variant="ghost" onClick={onClose} className="text-slate-400 hover:text-red-500 font-black uppercase text-xs tracking-widest"><X className="h-5 w-5 mr-2" /> Sair</Button>
    </header>
  );
}

function InsightItem({ label, value, color }: any) {
  return (
    <div className="flex flex-col border-r pr-6 last:border-0 last:pr-0">
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      <span className={cn("text-xs font-bold truncate max-w-[150px]", color)}>{value}</span>
    </div>
  );
}