import { z } from 'zod';
import { TipoRecorrencia } from '../types';

export const reservaFormSchema = z
  .object({
    dataInicio: z.date({ required_error: 'A data de início é obrigatória.' }),
    dataFim: z.date({ required_error: 'A data de fim é obrigatória.' }),
    projetoId: z.preprocess(
      val => (val === '' ? undefined : val),
      z.string().uuid({ message: 'O projeto selecionado é inválido.' }).optional(),
    ),
    tipoRecorrencia: z.nativeEnum(TipoRecorrencia).default(TipoRecorrencia.NAO_REPETE),
    dataFimRecorrencia: z.date().optional(),
  })
  .refine(data => data.dataFim > data.dataInicio, {
    message: 'A data/hora de fim deve ser posterior à de início.',
    path: ['dataFim'],
  })
  .superRefine((data, ctx) => {
    if (data.tipoRecorrencia === TipoRecorrencia.NAO_REPETE) {
      return;
    }

    if (!data.dataFimRecorrencia) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'A data fim de recorrência é obrigatória para reservas recorrentes.',
        path: ['dataFimRecorrencia'],
      });
      return;
    }

    if (data.dataFimRecorrencia <= data.dataInicio) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'A data fim de recorrência deve ser posterior à data de início.',
        path: ['dataFimRecorrencia'],
      });
    }
  });

export type ReservaFormValues = z.infer<typeof reservaFormSchema>;

export type ReservaCreatePayload = Omit<ReservaFormValues, 'dataInicio' | 'dataFim' | 'dataFimRecorrencia'> & {
  dataInicio: string;
  dataFim: string;
  usuarioSolicitanteId: string;
  status: 0;
  espacoId?: string;
  equipamentoId?: string;
  dataFimRecorrencia?: string;
};
