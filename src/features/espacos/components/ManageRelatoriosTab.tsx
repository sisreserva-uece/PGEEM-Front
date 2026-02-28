'use client';

import { Download, Calendar, BarChart3 } from 'lucide-react'; 
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner'; 
import { relatorioFormSchema, RelatorioFormValues, meses } from '@/features/relatorios/validation/relatorioSchema';
import { useDownloadRelatorioPdf } from '@/features/relatorios/services/RelatorioService';

type ManageRelatoriosTabProps = {
  espacoId: string;
};

export function ManageRelatoriosTab({ espacoId }: ManageRelatoriosTabProps) {
  const downloadMutation = useDownloadRelatorioPdf();
  
  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const mesAtual = hoje.getMonth() + 1;
  const anosDisponiveis = Array.from({ length: 3 }, (_, i) => anoAtual - 2 + i).reverse();

  const { setValue, handleSubmit, watch, formState: { errors } } = useForm<RelatorioFormValues>({
    resolver: zodResolver(relatorioFormSchema),
    defaultValues: {
      mes: mesAtual.toString().padStart(2, '0'),
      ano: anoAtual.toString(),
      espacoIds: [espacoId], 
    }
  });

  const selectedAno = watch('ano') || anoAtual.toString();

  useEffect(() => {
    setValue('espacoIds', [espacoId], { shouldValidate: true });
  }, [espacoId, setValue]);

  const onSubmit = async (data: RelatorioFormValues) => {
    const payload = {
      mes: data.mes ? parseInt(data.mes) : undefined,
      ano: data.ano ? parseInt(data.ano) : undefined,
      ids: [espacoId], 
      tipo: 'espacos' as const,
    };
  
    toast.promise(downloadMutation.mutateAsync(payload), {
      loading: 'Gerando relatório PDF...',
      success: 'Relatório gerado com sucesso!',
      error: 'Erro ao gerar relatório para este período.',
    });
  };

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
            <div className="flex items-center gap-2 font-bold text-sm text-[#475569]">
              <Calendar className="h-4 w-4 text-[#10B981]" />
              <span>Período de Referência</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-extrabold text-[#64748B]">Mês</Label>
                <Select onValueChange={(v) => setValue('mes', v)} defaultValue={watch('mes')}>
                  <SelectTrigger className="h-10 border-[#E2E8F0]">
                    <SelectValue placeholder="Selecione o mês" />
                  </SelectTrigger>
                  <SelectContent>
                    {meses.map((mes) => {
                      const isFuturo = parseInt(selectedAno) === anoAtual && parseInt(mes.v) > mesAtual;
                      return (
                        <SelectItem key={mes.v} value={mes.v} disabled={isFuturo}>
                          <span className={isFuturo ? "opacity-40" : ""}>{mes.l}</span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {errors.mes && <p className="text-[10px] text-red-500 font-bold">{errors.mes.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-extrabold text-[#64748B]">Ano</Label>
                <Select onValueChange={(v) => setValue('ano', v)} defaultValue={watch('ano')}>
                  <SelectTrigger className="h-10 border-[#E2E8F0]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {anosDisponiveis.map(year => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-[#F1F5F9] w-full" />

          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-sm text-[#475569]">
              <BarChart3 className="h-4 w-4 text-[#10B981]" />
              <span>Informações do Relatório</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              O documento incluirá o estatísticas do espaço utilizado.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
