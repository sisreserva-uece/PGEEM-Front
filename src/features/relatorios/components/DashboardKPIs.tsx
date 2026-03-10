import React from 'react';
import { Calendar, Target, AlertCircle, Activity, Boxes } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DashboardKPIs({ stats, insights, idsCount }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <CardKPI 
        title="Solicitadas" 
        value={stats?.totaisPeriodo?.totalReservasSolicitadas ?? 0} 
        color="blue" 
        icon={<Calendar />} 
      />
      <CardKPI 
        title="Aprovadas" 
        value={stats?.totaisPeriodo?.totalReservasAprovadas ?? 0} 
        color="emerald" 
        icon={<Target />} 
      />
      <CardKPI 
        title="Taxa Rejeição" 
        value={`${insights?.taxaRejeicao ?? 0}%`} 
        color="orange" 
        icon={<AlertCircle />} 
      />
      <CardKPI 
        title="Média Mensal" 
        value={insights?.mediaMensal ?? 0} 
        color="indigo" 
        icon={<Activity />} 
      />
      <CardKPI 
        title="Itens" 
        value={idsCount} 
        color="blue" 
        icon={<Boxes />} 
      />
    </div>
  );
}

function CardKPI({ title, value, color, icon }: any) {
  const themes: any = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100'
  };

  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 flex items-center justify-between hover:shadow-xl transition-all duration-300">
      <div className="space-y-1">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
        <p className={cn("text-3xl font-black", themes[color].split(' ')[1])}>{value}</p>
      </div>
      <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center border shadow-inner", themes[color])}>
        {React.cloneElement(icon, { className: "h-7 w-7" })}
      </div>
    </div>
  );
}
