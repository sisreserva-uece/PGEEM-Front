import { z } from 'zod';

export const projetoFormSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  descricao: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres.'),
  dataInicio: z.date({ required_error: 'A data de início é obrigatória.' }),
  dataFim: z.date({ required_error: 'A data de fim é obrigatória.' }),
  usuarioResponsavelId: z.string().uuid('Selecione um usuário responsável.'),
  instituicaoId: z.string().uuid('A instituição é obrigatória.'),
}).refine(data => data.dataFim > data.dataInicio, {
  message: 'A data de fim deve ser posterior à data de início.',
  path: ['dataFim'],
});

export type ProjetoFormValues = z.infer<typeof projetoFormSchema>;
export type ProjetoCreatePayload = Omit<ProjetoFormValues, 'dataInicio' | 'dataFim'> & {
  dataInicio: string; // YYYY-MM-DD
  dataFim: string; // YYYY-MM-DD
};
