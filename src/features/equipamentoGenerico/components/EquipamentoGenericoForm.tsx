// features/equipamentoGenerico/components/EquipamentoGenericoForm.tsx

'use client';

import type { EquipamentoGenerico } from '../types';
import type { EquipamentoGenericoCreatePayload } from '../validation/equipamentoGenericoSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  useCreateEquipamentoGenerico,
  useUpdateEquipamentoGenerico,
} from '../services/equipamentoGenericoService';
import { equipamentoGenericoSchema } from '../validation/equipamentoGenericoSchema';

type EquipamentoGenericoFormProps = {
  entity?: EquipamentoGenerico | null;
  onSuccess: () => void;
};

export function EquipamentoGenericoForm({
  entity: equipamento,
  onSuccess,
}: EquipamentoGenericoFormProps) {
  const isEditMode = !!equipamento;

  const form = useForm<EquipamentoGenericoCreatePayload>({
    resolver: zodResolver(equipamentoGenericoSchema),
    defaultValues: {
      nome: equipamento?.nome ?? '',
    },
  });

  const createMutation = useCreateEquipamentoGenerico();
  const updateMutation = useUpdateEquipamentoGenerico();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (values: EquipamentoGenericoCreatePayload) => {
    const promise = isEditMode
      ? updateMutation.mutateAsync({ id: equipamento.id, ...values })
      : createMutation.mutateAsync(values);

    toast.promise(promise, {
      loading: `${isEditMode ? 'Atualizando' : 'Criando'} equipamento genérico...`,
      success: () => {
        onSuccess();
        return `Equipamento genérico ${isEditMode ? 'atualizado' : 'criado'} com sucesso!`;
      },
      error: err =>
        `Erro ao salvar equipamento genérico: ${err.message}`,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Cadeira, Lousa, Lixeira..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
