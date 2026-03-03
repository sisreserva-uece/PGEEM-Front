import { z } from 'zod';

export const relatorioFormSchema = z.object({
  mesInicial: z.string(),
  anoInicial: z.string(),
  mesFinal: z.string(),
  anoFinal: z.string(),
  espacoIds: z.array(z.string()).min(1, "Selecione um espaço"),
}).superRefine((data, ctx) => {
  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const mesAtual = hoje.getMonth() + 1;

  const ini = { m: parseInt(data.mesInicial), a: parseInt(data.anoInicial) };
  const fim = { m: parseInt(data.mesFinal), a: parseInt(data.anoFinal) };

  if (ini.a > anoAtual || (ini.a === anoAtual && ini.m > mesAtual)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "A data inicial não pode ser futura",
      path: ["mesInicial"],
    });
  }

  if (fim.a > anoAtual || (fim.a === anoAtual && fim.m > mesAtual)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "A data final não pode ser futura",
      path: ["mesFinal"],
    });
  }

  const valorInicio = ini.a * 100 + ini.m;
  const valorFim = fim.a * 100 + fim.m;

  if (valorInicio > valorFim) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "O início do período não pode ser posterior ao fim",
      path: ["mesInicial"], 
    });
  }
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