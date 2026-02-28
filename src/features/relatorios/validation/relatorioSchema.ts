import { z } from 'zod';

export const relatorioFormSchema = z.object({
  mes: z.string().optional(),
  ano: z.string().optional(),
  espacoIds: z.array(z.string()).min(1, "Selecione pelo menos um item"),
}).refine((data) => {
  if (!data.mes || !data.ano) return true;

  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const mesAtual = hoje.getMonth() + 1;

  const anoSel = parseInt(data.ano);
  const mesSel = parseInt(data.mes);

  // Se o ano for futuro, bloqueia sempre
  if (anoSel > anoAtual) return false;

  // Se o ano for o atual, bloqueia se o mês for futuro
  if (anoSel === anoAtual && mesSel > mesAtual) return false;

  // Se o ano for anterior, retorna true.
  return true;
}, {
  message: "Não é possível selecionar uma data futura.",
  path: ["mes"],
});

export type RelatorioFormValues = z.infer<typeof relatorioFormSchema>;

export type RelatorioConfigProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  tipo: 'espacos' | 'equipamentos';
  idsSelecionados: string[]; 
  listaNomes: string[];     
};

export const meses = [
  { v: '01', l: 'Janeiro' }, { v: '02', l: 'Fevereiro' },
  { v: '03', l: 'Março' }, { v: '04', l: 'Abril' },
  { v: '05', l: 'Maio' }, { v: '06', l: 'Junho' },
  { v: '07', l: 'Julho' }, { v: '08', l: 'Agosto' },
  { v: '09', l: 'Setembro' }, { v: '10', l: 'Outubro' },
  { v: '11', l: 'Novembro' }, { v: '12', l: 'Dezembro' },
];