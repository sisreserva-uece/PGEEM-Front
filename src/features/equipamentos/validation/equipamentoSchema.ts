import { z } from 'zod';
import { EquipamentoStatus } from '../types';

export const tipoEquipamentoFormSchema = z.object({
  nome: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  isDetalhamentoObrigatorio: z.boolean(),
});

export const equipamentoSchema = z.object({
  tombamento: z.string().min(1, { message: 'O tombamento é obrigatório.' }),
  descricao: z.string().optional(),
  status: z.nativeEnum(EquipamentoStatus, { errorMap: () => ({ message: 'Status é obrigatório.' }) }),
  tipoEquipamentoId: z.string().min(1, { message: 'O Tipo de Equipamento é obrigatório.' }),
  reservavel: z.boolean(),
});

export const equipamentoUpdateSchema = equipamentoSchema.pick({
  descricao: true,
  status: true,
  reservavel: true,
});

export const tipoEquipamentoUpdateSchema = tipoEquipamentoFormSchema.pick({
  nome: true,
});

export type TipoEquipamentoCreatePayload = z.infer<typeof tipoEquipamentoFormSchema>;
export type TipoEquipamentoUpdatePayload = z.infer<typeof tipoEquipamentoUpdateSchema>;
export type EquipamentoCreatePayload = z.infer<typeof equipamentoSchema>;
export type EquipamentoUpdatePayload = z.infer<typeof equipamentoUpdateSchema>;
