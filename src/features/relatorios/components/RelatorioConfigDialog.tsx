'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Calendar, FileText, Download, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { relatorioFormSchema, RelatorioFormValues, RelatorioConfigProps, meses } from '../validation/relatorioSchema';
import { useDownloadRelatorioPdf } from '../services/RelatorioService';

export function RelatorioConfigDialog({ 
  isOpen, 
  onOpenChange, 
  tipo, 
  idsSelecionados = [], 
  listaNomes = []       
}: RelatorioConfigProps){
  const downloadMutation = useDownloadRelatorioPdf();
  
  const { setValue, handleSubmit, watch, formState: { errors } } = useForm<RelatorioFormValues>({
    resolver: zodResolver(relatorioFormSchema),
    defaultValues: {
      mes: '01',
      ano: '2026',
      espacoIds: idsSelecionados,
    }
  });

  const selectedAno = watch('ano') || new Date().getFullYear().toString(); 
  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const mesAtual = hoje.getMonth() + 1;
  const anosDisponiveis = Array.from({ length: 3 }, (_, i) => anoAtual - 2 + i).reverse();

  useEffect(() => {
    if (idsSelecionados && idsSelecionados.length > 0) {
      setValue('espacoIds', idsSelecionados, { shouldValidate: true });
    }
  }, [idsSelecionados, setValue]);

  const onSubmit = async (data: RelatorioFormValues) => {
    const payload = {
      mes: data.mes ? parseInt(data.mes) : undefined,
      ano: data.ano ? parseInt(data.ano) : undefined,
      ids: idsSelecionados, 
      tipo: tipo,
    };
  
    toast.promise(downloadMutation.mutateAsync(payload), {
      loading: 'Gerando relatório...',
      success: 'Download iniciado!',
      error: 'Erro ao gerar relatório.',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#10B981]" />
            Gerar Relatório de {tipo === 'espacos' ? 'Espaços' : 'Equipamentos'}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Configure o período e os detalhes para a exportação do arquivo PDF.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">

          <div className="space-y-3">
            <Label className="flex items-center justify-between font-bold text-[#475569]">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#10B981]" /> Itens Selecionados
              </span>
            </Label>
            <ScrollArea className="h-[100px] border rounded-md bg-slate-50 p-2">
                    <div className="grid grid-cols-2 gap-2">
              {listaNomes && listaNomes.length > 0 ? (
                listaNomes.map((nome, i) => (
                  <div key={i} className="text-[10px] bg-white p-1 border rounded truncate uppercase font-medium">
                    • {nome}
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground col-span-2 text-center py-4">
                  Nenhum item selecionado.
                </p>
              )}
            </div>
            </ScrollArea>
          </div>

          <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
      <Label className="flex items-center gap-2 text-[#475569] font-semibold">
        <Calendar className="h-4 w-4" /> Mês de Referência
      </Label>
      <Select onValueChange={(v) => setValue('mes', v)} defaultValue={watch('mes')}>
        <SelectTrigger className="h-10 border-[#E2E8F0]">
          <SelectValue placeholder="Selecione o mês" />
        </SelectTrigger>
        <SelectContent>
          {meses.map((mes) => {
            const isFuturo = parseInt(selectedAno) === anoAtual && parseInt(mes.v) > mesAtual;

            return (
              <SelectItem 
                key={mes.v} 
                value={mes.v} 
                disabled={isFuturo}
              >
                <span className={isFuturo ? "text-slate-300 opacity-50" : ""}>
                  {mes.l}
                </span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
        {errors.mes && <span className="text-xs text-red-500">{errors.mes.message}</span>}
      </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">Ano</Label>
                <Select onValueChange={(v) => setValue('ano', v)} defaultValue={watch('ano')}>
                  <SelectTrigger className="h-10 border-[#E2E8F0]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                  {anosDisponiveis.map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button 
              type="submit" 
              className="bg-[#10B981] hover:bg-[#059669] text-white font-bold"
              disabled={downloadMutation.isPending || idsSelecionados.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              {downloadMutation.isPending ? 'Processando...' : 'Baixar PDF'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}