import { Trophy, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function DashboardRanking({ usuarios, searchTerm, onSearchChange }: any) {
  return (
    <div className="xl:col-span-4 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col h-[650px] overflow-hidden">
      <div className="p-8 border-b space-y-6">
        <h3 className="text-lg font-black text-slate-800 uppercase flex items-center gap-3">
          <Trophy className="h-6 w-6 text-amber-500" /> Ranking Detalhado
        </h3>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input 
            placeholder="Buscar por nome..." 
            className="pl-12 h-12 rounded-2xl bg-slate-50 border-slate-200 focus-visible:ring-emerald-500" 
            value={searchTerm} 
            onChange={(e) => onSearchChange(e.target.value)} 
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <table className="w-full text-left">
          <thead className="bg-slate-50 sticky top-0 border-b">
            <tr>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Utilizador</th>
              <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Aprovação %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {usuarios.length > 0 ? (
              usuarios.map((u: any, i: number) => (
                <tr key={i} className="hover:bg-slate-50/70 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">{u.usuarioNome}</span>
                      <span className="text-[10px] text-slate-400 font-mono">Conf: {u.reservasConfirmadas}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex flex-col items-end">
                      <span className={cn("text-sm font-black", u.taxaAprovacao > 70 ? "text-emerald-600" : "text-amber-600")}>
                        {u.taxaAprovacao}%
                      </span>
                      <div className="w-16 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 transition-all duration-500" 
                          style={{ width: `${u.taxaAprovacao}%` }} 
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="px-8 py-10 text-center text-slate-400 italic text-sm">
                  Nenhum usuário encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}