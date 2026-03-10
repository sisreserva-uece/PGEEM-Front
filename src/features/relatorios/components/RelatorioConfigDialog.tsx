'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Calendar, FileText, Download, CheckCircle2, AlertCircle } from 'lucide-react';
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
  const [mounted, setMounted] = React.useState(false);
  const downloadMutation = useDownloadRelatorioPdf();
  
  const hoje = new Date();
  const anoAtualStr = hoje.getFullYear().toString();
  const mesAtualStr = (hoje.getMonth() + 1).toString().padStart(2, '0');
  const anoAtual = hoje.getFullYear();
  const mesAtual = hoje.getMonth() + 1;

  const { setValue, handleSubmit, watch, formState: { errors } } = useForm<RelatorioFormValues>({
    resolver: zodResolver(relatorioFormSchema),
    defaultValues: {
      mesInicial: mesAtualStr,
      anoInicial: anoAtualStr,
      mesFinal: mesAtualStr,
      anoFinal: anoAtualStr,
      espacoIds: idsSelecionados,
    }
  });

  const anosDisponiveis = Array.from({ length: 5 }, (_, i) => anoAtual - 4 + i).reverse();

  useEffect(() => {
    setMounted(true);
    if (idsSelecionados && idsSelecionados.length > 0) {
      setValue('espacoIds', idsSelecionados, { shouldValidate: true });
    }
  }, [idsSelecionados, setValue]);

  const onSubmit = async (data: RelatorioFormValues) => {
    const payload = {
      mesInicial: parseInt(data.mesInicial),
      anoInicial: parseInt(data.anoInicial),
      mesFinal: parseInt(data.mesFinal),
      anoFinal: parseInt(data.anoFinal),
      ids: idsSelecionados, 
      tipo: tipo, 
    };
  
    toast.promise(downloadMutation.mutateAsync(payload), {
      loading: 'Gerando relatório...',
      success: 'Download iniciado!',
      error: 'Erro ao gerar relatório.',
    });
  };

  if (!mounted) {
    return null; 
  }

  const renderPeriodoFields = (label: string, prefix: 'Inicial' | 'Final') => (
    <div className="space-y-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50">
      <Label className="text-xs font-bold text-[#475569] uppercase flex items-center gap-2">
        <Calendar className="h-3 w-3 text-[#10B981]" /> {label}
      </Label>
      <div className="grid grid-cols-2 gap-3">
        <Select 
          onValueChange={(v) => setValue(`mes${prefix}`, v, { shouldValidate: true })} 
          value={watch(`mes${prefix}`)}
        >
          <SelectTrigger className="h-9 bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {meses.map((m) => {
              const anoSel = watch(`ano${prefix}`);
              const isFuturo = parseInt(anoSel) === anoAtual && parseInt(m.v) > mesAtual;
              return (
                <SelectItem key={m.v} value={m.v} disabled={isFuturo}>
                  <span className={isFuturo ? "opacity-30" : ""}>{m.l}</span>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        <Select 
          onValueChange={(v) => setValue(`ano${prefix}`, v, { shouldValidate: true })} 
          value={watch(`ano${prefix}`)}
        >
          <SelectTrigger className="h-9 bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {anosDisponiveis.map(y => (
              <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5 text-[#10B981]" />
            Relatório de {tipo === 'espacos' ? 'Espaços' : 'Equipamentos'}
          </DialogTitle>
          <DialogDescription>
            Defina o intervalo de tempo para as estatísticas dos itens selecionados.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-slate-500 uppercase">Itens incluídos no PDF</Label>
            <ScrollArea className="h-[80px] w-full border rounded-md bg-slate-50 p-2">
              <div className="flex flex-wrap gap-1">
                {listaNomes.map((nome, i) => (
                  <div key={i} className="text-[9px] bg-white px-2 py-0.5 border border-slate-200 rounded-full text-slate-600 font-semibold">
                    {nome}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="space-y-4">
            {renderPeriodoFields("Início do Período", "Inicial")}
            {renderPeriodoFields("Fim do Período", "Final")}

            {(errors.mesInicial || errors.mesFinal) && (
              <div className="flex items-start gap-2 p-3 rounded-md bg-red-50 border border-red-100 text-red-600">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <div className="flex flex-col gap-1">
                  {errors.mesInicial && <p className="text-xs font-bold">{errors.mesInicial.message}</p>}
                  {errors.mesFinal && <p className="text-xs font-bold">{errors.mesFinal.message}</p>}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="pt-4 gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-[#10B981] hover:bg-[#059669] text-white px-8"
              disabled={downloadMutation.isPending || idsSelecionados.length === 0}
            >
              {downloadMutation.isPending ? 'Gerando...' : (
                <><Download className="mr-2 h-4 w-4" /> Gerar PDF</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}