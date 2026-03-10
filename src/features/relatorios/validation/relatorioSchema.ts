import { z } from 'zod';

export const meses = [
  { v: '01', l: 'Janeiro' }, { v: '02', l: 'Fevereiro' },
  { v: '03', l: 'Março' }, { v: '04', l: 'Abril' },
  { v: '05', l: 'Maio' }, { v: '06', l: 'Junho' },
  { v: '07', l: 'Julho' }, { v: '08', l: 'Agosto' },
  { v: '09', l: 'Setembro' }, { v: '10', l: 'Outubro' },
  { v: '11', l: 'Novembro' }, { v: '12', l: 'Dezembro' },
];

const dataFields = {
  mesInicial: z.string().min(1, "Obrigatório"),
  anoInicial: z.string().min(1, "Obrigatório"),
  mesFinal: z.string().min(1, "Obrigatório"),
  anoFinal: z.string().min(1, "Obrigatório"),
};

const validarDatas = (data: any, ctx: z.RefinementCtx) => {
  const hoje = new Date();
  const valorInicio = parseInt(data.anoInicial) * 100 + parseInt(data.mesInicial);
  const valorFim = parseInt(data.anoFinal) * 100 + parseInt(data.mesFinal);
  const valorHoje = hoje.getFullYear() * 100 + (hoje.getMonth() + 1);

  if (valorInicio > valorHoje) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Início futuro", path: ["mesInicial"] });
  if (valorFim > valorHoje) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Fim futuro", path: ["mesFinal"] });
  if (valorInicio > valorFim) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Início após o fim", path: ["mesInicial"] });
};

export const dashboardFilterSchema = z.object({
  ...dataFields,
  equipamentoIds: z.array(z.string()).optional(),
  tipoEquipamentoId: z.string().optional(),
  multiusuario: z.boolean().optional(),
  espacoIds: z.array(z.string()).optional(),
  departamentoId: z.string().optional(),
  localizacaoId: z.string().optional(),
}).superRefine(validarDatas);

export const relatorioFormSchema = z.object({
  ...dataFields,
  espacoIds: z.array(z.string()).min(1, "Selecione um espaço"),
}).superRefine(validarDatas);

export type DashboardFilterValues = z.infer<typeof dashboardFilterSchema>;
export type RelatorioFormValues = z.infer<typeof relatorioFormSchema>;