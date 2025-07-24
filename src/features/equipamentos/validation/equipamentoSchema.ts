import { z } from 'zod';
import { EquipamentoStatus } from '../types';

export const tipoEquipamentoSchema = z.object({
  nome: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  isDetalhamentoObrigatorio: z.boolean(),
});

export const equipamentoSchema = z.object({
  tombamento: z.string().min(1, { message: 'O tombamento é obrigatório.' }),
  descricao: z.string().optional(),
  status: z.nativeEnum(EquipamentoStatus, { errorMap: () => ({ message: 'Status é obrigatório.' }) }),
  tipoEquipamentoId: z.string().uuid({ message: 'O Tipo de Equipamento é obrigatório.' }),
});

export type TipoEquipamentoFormValues = z.infer<typeof tipoEquipamentoSchema>;
export type EquipamentoFormValues = z.infer<typeof equipamentoSchema>;
