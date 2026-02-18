import { z } from 'zod';

export const reservaFormSchema = z.object({
  dataInicio: z.date({ required_error: 'A data de início é obrigatória.' }),
  dataFim: z.date({ required_error: 'A data de fim é obrigatória.' }),
  projetoId: z.preprocess(
    val => (val === '' ? undefined : val),
    z.string().uuid({ message: 'O projeto selecionado é inválido.' }).optional(),
  ),
}).refine(data => data.dataFim > data.dataInicio, {
  message: 'A data/hora de fim deve ser posterior à de início.',
  path: ['dataFim'],
});

export type ReservaFormValues = z.infer<typeof reservaFormSchema>;
export type ReservaCreatePayload = Omit<ReservaFormValues, 'dataInicio' | 'dataFim'> & {
  dataInicio: string;
  dataFim: string;
  usuarioSolicitanteId: string;
  status: 0;
  espacoId?: string;
  equipamentoId?: string;
};
