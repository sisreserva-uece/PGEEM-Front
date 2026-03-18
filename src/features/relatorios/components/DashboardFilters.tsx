import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronUp, ChevronDown, Filter, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { meses } from '../validation/relatorioSchema';
import { useMemo } from 'react';

export function DashboardFilters({ form, tipo, departamentos, localizacoes, tiposEquipamento }: any) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { watch, setValue, reset } = form;
  const filtrosAtuais = watch();

  return (
    <section className="bg-white border-b shrink-0 z-20 shadow-sm transition-all duration-300 ease-in-out">
      <div className="px-10 py-3 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-white border rounded-lg shadow-sm">
            <Filter className="h-4 w-4 text-slate-500" />
          </div>
          <span className="text-xs font-black text-slate-700 uppercase tracking-widest">
            Painel de Filtros
          </span>
          {!isExpanded && (
            <div className="flex items-center gap-2 ml-4 animate-in fade-in slide-in-from-left-2">
              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                {filtrosAtuais.mesInicial}/{filtrosAtuais.anoInicial}
              </span>
              <span className="text-[10px] text-slate-400">até</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                {filtrosAtuais.mesFinal}/{filtrosAtuais.anoFinal}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => reset()}
            className="h-8 text-[10px] font-bold uppercase text-slate-400 hover:text-amber-600 transition-colors"
          >
            <RotateCcw className="h-3 w-3 mr-2" /> Resetar
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0 rounded-full bg-white border shadow-sm hover:bg-slate-50"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className={cn(
        "px-10 overflow-hidden transition-all duration-300 ease-in-out",
        isExpanded ? "py-6 opacity-100 max-h-[500px]" : "max-h-0 opacity-0 py-0"
      )}>
        <div className="flex flex-wrap items-end gap-8">
          <div className="flex gap-4">
             <SeletorData label="De" mes={filtrosAtuais.mesInicial} ano={filtrosAtuais.anoInicial} onMesChange={(v: any) => setValue('mesInicial', v)} onAnoChange={(v: any) => setValue('anoInicial', v)} />
             <SeletorData label="Até" mes={filtrosAtuais.mesFinal} ano={filtrosAtuais.anoFinal} onMesChange={(v: any) => setValue('mesFinal', v)} onAnoChange={(v: any) => setValue('anoFinal', v)} />
          </div>

          <div className="h-12 w-[1px] bg-slate-100 hidden xl:block" />

          <div className="flex items-end gap-6 flex-1">
             {tipo === 'espacos' ? (
               <>
                 <FilterSelect label="Departamento" value={filtrosAtuais.departamentoId} onValueChange={(v: any) => setValue('departamentoId', v)} options={departamentos} placeholder="Todos Departamentos" prefix="dept" />
                 <FilterSelect label="Localização" value={filtrosAtuais.localizacaoId} onValueChange={(v: any) => setValue('localizacaoId', v)} options={localizacoes} placeholder="Todos" prefix="loc" />
               </>
             ) : (
               <FilterSelect label="Tipo Equipamento" value={filtrosAtuais.tipoEquipamentoId} onValueChange={(v: any) => setValue('tipoEquipamentoId', v)} options={tiposEquipamento} placeholder="Todos Equipamentos" prefix="equip" />
             )}
          </div>
        </div>
      </div>
    </section>
  );
}

function SeletorData({ label, mes, ano, onMesChange, onAnoChange }: any) {
  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const mesAtual = hoje.getMonth() + 1;
  const anosPermitidos = [anoAtual, anoAtual - 1, anoAtual - 2].map(String);

  return (
    <div className="space-y-2">
      <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">{label}</Label>
      <div className="flex gap-2">
        <Select value={mes} onValueChange={onMesChange}>
          <SelectTrigger className="h-11 w-[140px] rounded-xl font-bold"><SelectValue /></SelectTrigger>
          <SelectContent className="z-[200]">
            {meses.map((m) => <SelectItem key={m.v} value={m.v} disabled={parseInt(ano) === anoAtual && parseInt(m.v) > mesAtual}>{m.l}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={ano} onValueChange={onAnoChange}>
          <SelectTrigger className="h-11 w-[90px] rounded-xl font-bold"><SelectValue /></SelectTrigger>
          <SelectContent className="z-[200]">
            {anosPermitidos.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onValueChange, options, placeholder, prefix, isRawArray }: any) {
  return (
    <div className="flex-1 space-y-2">
      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-11 bg-slate-50 border-slate-200 rounded-xl font-bold"><SelectValue placeholder={placeholder} /></SelectTrigger>
        <SelectContent className="z-[150]">
          <SelectItem value="all">{placeholder}</SelectItem>
          {options?.map((it: any, i: number) => (
            <SelectItem key={`${prefix}-${it.id || it.value || i}`} value={(it.id || it.value)?.toString()}>
              {it.nome || it.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}