import { z } from 'zod';

export const espacoFormSchema = z.object({
  nome: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  urlCnpq: z.string().url({ message: 'Por favor, insira uma URL válida.' }).or(z.literal('')),
  observacao: z.string().optional(),
  departamentoId: z.string().uuid({ message: 'Departamento é obrigatório.' }),
  localizacaoId: z.string().uuid({ message: 'Localização é obrigatória.' }),
  tipoEspacoId: z.string().uuid({ message: 'Tipo de Espaço é obrigatório.' }),
  tipoAtividadeId: z.string().uuid({ message: 'Tipo de Atividade é obrigatório.' }),
  precisaProjeto: z.boolean(),
});

export const espacoUpdateSchema = espacoFormSchema.pick({
  nome: true,
  urlCnpq: true,
  observacao: true,
  precisaProjeto: true,
});

export const tipoEspacoFormSchema = z.object({
  nome: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }).max(100),
});

export type TipoEspacoCreatePayload = z.infer<typeof tipoEspacoFormSchema>;
export type TipoEspacoUpdatePayload = Partial<TipoEspacoCreatePayload>;
export type EspacoCreatePayload = z.infer<typeof espacoFormSchema>;
export type EspacoUpdatePayload = z.infer<typeof espacoUpdateSchema>;
