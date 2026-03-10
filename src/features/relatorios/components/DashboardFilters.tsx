import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { meses } from '../validation/relatorioSchema';
import { useMemo } from 'react';

export function DashboardFilters({ form, tipo, departamentos, localizacoes, tiposEquipamento }: any) {
  const { watch, setValue } = form;
  const filtrosAtuais = watch();

  return (
    <section className="px-10 py-5 bg-white border-b flex flex-wrap items-end gap-8 shrink-0 z-20 shadow-sm">
      <div className="flex gap-4">
        <SeletorData label="Período" mes={filtrosAtuais.mesInicial} ano={filtrosAtuais.anoInicial} 
          onMesChange={(v: string) => setValue('mesInicial', v)} onAnoChange={(v: string) => setValue('anoInicial', v)} />
        <SeletorData label="até" mes={filtrosAtuais.mesFinal} ano={filtrosAtuais.anoFinal} 
          onMesChange={(v: string) => setValue('mesFinal', v)} onAnoChange={(v: string) => setValue('anoFinal', v)} />
      </div>

      <div className="h-12 w-[1px] bg-slate-100 hidden xl:block" />

      <div className="flex items-end gap-6 flex-1 min-w-[500px]">
        {tipo === 'espacos' ? (
          <>
            <FilterSelect label="Departamento" value={filtrosAtuais.departamentoId} onValueChange={(v: string) => setValue('departamentoId', v)} options={departamentos} placeholder="Todos Departamentos" prefix="dept" />
            <FilterSelect label="Localização" value={filtrosAtuais.localizacaoId} onValueChange={(v: string) => setValue('localizacaoId', v)} options={localizacoes} placeholder="Todas Localizações" prefix="loc" />
          </>
        ) : (
          <>
            <FilterSelect label="Tipo de Equipamento" value={filtrosAtuais.tipoEquipamentoId} onValueChange={(v: string) => setValue('tipoEquipamentoId', v)} options={tiposEquipamento} placeholder="Todos os Tipos" isRawArray />
            <div className="flex items-center gap-4 h-11 px-6 bg-slate-50 border border-slate-200 rounded-xl hover:border-emerald-500 transition-colors cursor-pointer group">
              <Switch id="dash-multi" checked={filtrosAtuais.multiusuario} onCheckedChange={(v: boolean) => setValue('multiusuario', v)} />
              <Label htmlFor="dash-multi" className="text-[10px] font-black text-slate-600 uppercase cursor-pointer">Multiusuário</Label>
            </div>
          </>
        )}
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