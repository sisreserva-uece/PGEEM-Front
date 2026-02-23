'use client';

import { BarChart3, Calendar, Download } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type ManageRelatoriosTabProps = {
  espacoId: string;
};

const MESES = [
  { label: 'Janeiro', value: '01' },
  { label: 'Fevereiro', value: '02' },
  { label: 'Março', value: '03' },
  { label: 'Abril', value: '04' },
  { label: 'Maio', value: '05' },
  { label: 'Junho', value: '06' },
  { label: 'Julho', value: '07' },
  { label: 'Agosto', value: '08' },
  { label: 'Setembro', value: '09' },
  { label: 'Outubro', value: '10' },
  { label: 'Novembro', value: '11' },
  { label: 'Dezembro', value: '12' },
];

const ANOS = ['2024', '2025', '2026'];

export function ManageRelatoriosTab({ espacoId }: ManageRelatoriosTabProps) {
  const [loading, setLoading] = useState(false);

  const handleGerarRelatorio = () => {
    toast.info('Funcionalidade em desenvolvimento', {
      description: 'O módulo de exportação de PDF será liberado em breve.',
    });

    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold">Gerenciar Relatórios</h3>
          <p className="text-sm text-muted-foreground">Configure os filtros e gere o relatório de uso em PDF.</p>
        </div>
        <Button
          type="button"
          onClick={handleGerarRelatorio}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {loading
            ? (
                'Aguarde...'
              )
            : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Relatório
                </>
              )}
        </Button>
      </div>

      <div className="space-y-6 rounded-lg border p-4">

        <div className="space-y-4">
          <div className="flex items-center gap-2 font-medium text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Período das Reservas</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Início</Label>
              <div className="flex gap-2">
                <Select defaultValue="01">
                  <SelectTrigger className="h-9"><SelectValue placeholder="Mês" /></SelectTrigger>
                  <SelectContent>
                    {MESES.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select defaultValue="2026">
                  <SelectTrigger className="h-9"><SelectValue placeholder="Ano" /></SelectTrigger>
                  <SelectContent>
                    {ANOS.map(ano => <SelectItem key={ano} value={ano}>{ano}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Fim</Label>
              <div className="flex gap-2">
                <Select defaultValue="12">
                  <SelectTrigger className="h-9"><SelectValue placeholder="Mês" /></SelectTrigger>
                  <SelectContent>
                    {MESES.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select defaultValue="2026">
                  <SelectTrigger className="h-9"><SelectValue placeholder="Ano" /></SelectTrigger>
                  <SelectContent>
                    {ANOS.map(ano => <SelectItem key={ano} value={ano}>{ano}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[1px] bg-border w-full" />

        <div className="space-y-4">
          <div className="flex items-center gap-2 font-medium text-sm">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <span>Estatísticas de Uso</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="top-users" className="text-xs">Top usuários (mais frequentes)</Label>
            <Select defaultValue="none">
              <SelectTrigger id="top-users" className="h-9 w-full md:w-[250px]">
                <SelectValue placeholder="Selecione a quantidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Não incluir ranking</SelectItem>
                <SelectItem value="5">Listar Top 5 usuários</SelectItem>
                <SelectItem value="10">Listar Top 10 usuários</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
