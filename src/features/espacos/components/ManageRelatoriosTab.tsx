'use client';

import { useState, useEffect } from 'react';
import { Download, Calendar, BarChart3 } from 'lucide-react'; 
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner'; 
import { relatorioFormSchema, RelatorioFormValues, meses } from '@/features/relatorios/validation/relatorioSchema';
import { useDownloadRelatorioPdf } from '@/features/relatorios/services/RelatorioService';

type ManageRelatoriosTabProps = {
  id: string;
  tipo: 'espacos' | 'equipamentos';
};

export function ManageRelatoriosTab({ id, tipo }: ManageRelatoriosTabProps) {
  const [mounted, setMounted] = useState(false);
  const downloadMutation = useDownloadRelatorioPdf();
  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const mesAtual = hoje.getMonth() + 1;
  const anoAtualStr = hoje.getFullYear().toString();
  const mesAtualStr = (hoje.getMonth() + 1).toString().padStart(2, '0');
  const anosDisponiveis = Array.from({ length: 5 }, (_, i) => anoAtual - 4 + i).reverse();

  useEffect(() => {
    setMounted(true);
  }, []);

  const { setValue, handleSubmit, watch, formState: { errors } } = useForm<RelatorioFormValues>({
    resolver: zodResolver(relatorioFormSchema),
    defaultValues: {
      mesInicial: mesAtualStr,
      anoInicial: anoAtualStr,
      mesFinal: mesAtualStr,
      anoFinal: anoAtualStr,
      espacoIds: [id],
    }
  });

  
  const isDataFutura = (mes: string, ano: string) => {
    if (!ano) return false;
    const a = parseInt(ano);
    const m = parseInt(mes);
    if (a > anoAtual) return true;
    if (a === anoAtual && m > mesAtual) return true;
    return false;
  };

  const onSubmit = async (data: RelatorioFormValues) => {
    const payload = {
      mesInicial: data.mesInicial ? parseInt(data.mesInicial) : undefined,
      anoInicial: data.anoInicial ? parseInt(data.anoInicial) : undefined,
      mesFinal: data.mesFinal ? parseInt(data.mesFinal) : undefined,
      anoFinal: data.anoFinal ? parseInt(data.anoFinal) : undefined,
      ids: [id],
      tipo: tipo,
    };
  
    toast.promise(downloadMutation.mutateAsync(payload), {
      loading: 'Gerando relatório PDF...',
      success: 'Relatório baixado!',
      error: (err) => err.response?.data?.message || 'Erro ao gerar relatório.',
    });
  };

  const renderSelectPeriodo = (tipo: 'Inicial' | 'Final') => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label className="text-[10px] uppercase font-extrabold text-[#64748B]">Mês {tipo}</Label>
        <Select 
          onValueChange={(v) => setValue(`mes${tipo}`, v === "none" ? "" : v)} 
          value={watch(`mes${tipo}`) || "none"}
        >
          <SelectTrigger className="h-10 border-[#E2E8F0]">
            <SelectValue placeholder="Atual (Padrão)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none" className="text-muted-foreground italic">
              Mês Atual
            </SelectItem>
            {meses.map((mes) => {
              const disabled = isDataFutura(mes.v, watch(`ano${tipo}`) || anoAtual.toString());
              return (
                <SelectItem key={mes.v} value={mes.v} disabled={disabled}>
                  <span className={disabled ? "opacity-30" : ""}>{mes.l}</span>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] uppercase font-extrabold text-[#64748B]">Ano {tipo}</Label>
        <Select 
          onValueChange={(v) => setValue(`ano${tipo}`, v === "none" ? "" : v)} 
          value={watch(`ano${tipo}`) || "none"}
        >
          <SelectTrigger className="h-10 border-[#E2E8F0]">
            <SelectValue placeholder="Ano Atual (Padrão)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none" className="text-muted-foreground italic">
              Ano Atual
            </SelectItem>
            {anosDisponiveis.map(year => (
              <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  if (!mounted) {
    return null; 
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-[#1E293B]">Gerenciar Relatórios</h3>
            <p className="text-sm text-muted-foreground">Selecione o período para exportar as estatísticas deste espaço.</p>
          </div>

          <Button 
            type="submit" 
            disabled={downloadMutation.isPending}
            className="bg-[#10B981] hover:bg-[#059669] text-white font-bold transition-all"
          >
            {downloadMutation.isPending ? (
              'Processando...'
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Baixar Relatório PDF
              </>
            )}
          </Button>
        </div>

        <div className="space-y-6 rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
          <div className="space-y-4">
             <div className="text-sm font-bold text-[#475569]">Início do Período</div>
             {renderSelectPeriodo('Inicial')} 
              {errors.mesInicial && (
                <p className="text-[10px] text-red-500 font-bold mt-1">{errors.mesInicial.message}</p>
              )}
              {errors.anoInicial && (
                <p className="text-[10px] text-orange-500 font-bold mt-1">{errors.anoInicial.message}</p>
              )}
             <div className="flex flex-col gap-1 mt-2">
              </div>
          </div>
          
          <div className="h-[1px] bg-[#F1F5F9] w-full" />

          <div className="space-y-4">
             <div className="text-sm font-bold text-[#475569]">Fim do Período</div>
             {renderSelectPeriodo('Final')}
             {errors.mesFinal && (
              <p className="text-[10px] text-red-500 font-bold mt-1">{errors.mesFinal.message}</p>
            )}
            {errors.anoFinal && (
              <p className="text-[10px] text-orange-500 font-bold mt-1">{errors.anoFinal.message}</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
