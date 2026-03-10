// features/espacos/components/ManageEquipamentosGenericosTab.tsx

'use client';

import type { EquipamentoGenerico } from '@/features/equipamentoGenerico/types';
import type { EquipamentoGenericoEspacoCreatePayload } from '@/features/equipamentoGenerico/validation/equipamentoGenericoEspacoSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Minus, Package, Plus, PlusCircle, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useAtualizarQuantidade,
  useDesvincularEquipamentoGenerico,
  useGetAllEquipamentosGenericos,
  useGetEquipamentosGenericosEspaco,
  useVincularEquipamentoGenerico,
} from '@/features/equipamentoGenerico/services/equipamentoGenericoService';
import { equipamentoGenericoEspacoCreateSchema } from '@/features/equipamentoGenerico/validation/equipamentoGenericoEspacoSchema';

// ---------------------------------------------------------------------------
// Add dialog
// ---------------------------------------------------------------------------

type AddEquipamentoGenericoDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  espacoId: string;
  /**
   * IDs of catalog items already allocated to this space.
   * Used to prevent duplicate bindings in the selector.
   */
  linkedIds: string[];
};

function AddEquipamentoGenericoDialog({
  open,
  onOpenChange,
  espacoId,
  linkedIds,
}: AddEquipamentoGenericoDialogProps) {
  const { data: catalog, isLoading: isLoadingCatalog }
    = useGetAllEquipamentosGenericos();
  const vincularMutation = useVincularEquipamentoGenerico();

  const form = useForm<EquipamentoGenericoEspacoCreatePayload>({
    resolver: zodResolver(equipamentoGenericoEspacoCreateSchema),
    defaultValues: {
      equipamentoGenericoId: '',
      espacoId,
      quantidade: 1,
    },
  });

  // Inject the parent-context espacoId whenever it changes.
  useEffect(() => {
    form.setValue('espacoId', espacoId);
  }, [espacoId, form]);

  const availableItems: EquipamentoGenerico[]
    = catalog?.filter(item => !linkedIds.includes(item.id)) ?? [];

  const onSubmit = (values: EquipamentoGenericoEspacoCreatePayload) => {
    toast.promise(vincularMutation.mutateAsync(values), {
      loading: 'Vinculando equipamento...',
      success: () => {
        onOpenChange(false);
        form.reset({ equipamentoGenericoId: '', espacoId, quantidade: 1 });
        return 'Equipamento vinculado com sucesso!';
      },
      error: err => `Erro ao vincular equipamento: ${err.message}`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Equipamento Genérico</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="equipamentoGenericoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipamento</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingCatalog}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isLoadingCatalog
                              ? 'Carregando...'
                              : availableItems.length === 0
                                ? 'Nenhum item disponível'
                                : 'Selecione um item'
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableItems.map(item => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade</FormLabel>
                  <FormControl>
                    {/*
                     * valueAsNumber is mandatory here.
                     * Without it, RHF gives Zod a string and
                     * z.number() rejects it with invalid_type_error.
                     */}
                    <Input
                      type="number"
                      min={1}
                      {...field}
                      onChange={e =>
                        field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* espacoId is a hidden field — injected by context, not the user */}
            <input type="hidden" {...form.register('espacoId')} />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={
                  vincularMutation.isPending || availableItems.length === 0
                }
              >
                {vincularMutation.isPending ? 'Salvando...' : 'Adicionar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Inline quantity stepper
// A single integer is the only mutable field — a full sheet would be
// UX overhead. The stepper commits on every increment/decrement.
// ---------------------------------------------------------------------------

type QuantityStepperProps = {
  vinculoId: string;
  espacoId: string;
  current: number;
};

function QuantityStepper({ vinculoId, espacoId, current }: QuantityStepperProps) {
  const atualizarMutation = useAtualizarQuantidade();
  const isPending = atualizarMutation.isPending;

  const commit = (next: number) => {
    if (next < 1 || isPending) {
      return;
    }
    toast.promise(
      atualizarMutation.mutateAsync({
        vinculoId,
        espacoId,
        quantidade: next,
      }),
      {
        loading: 'Atualizando quantidade...',
        success: 'Quantidade atualizada!',
        error: err => `Erro ao atualizar: ${err.message}`,
      },
    );
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-7 w-7"
        onClick={() => commit(current - 1)}
        disabled={current <= 1 || isPending}
        aria-label="Diminuir quantidade"
      >
        <Minus className="h-3 w-3" />
      </Button>
      <span className="w-8 text-center text-sm font-medium tabular-nums">
        {current}
      </span>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-7 w-7"
        onClick={() => commit(current + 1)}
        disabled={isPending}
        aria-label="Aumentar quantidade"
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main tab component
// ---------------------------------------------------------------------------

type ManageEquipamentosGenericosTabProps = {
  espacoId: string;
};

export function ManageEquipamentosGenericosTab({
  espacoId,
}: ManageEquipamentosGenericosTabProps) {
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);

  const {
    data: allocations,
    isLoading,
    isError,
  } = useGetEquipamentosGenericosEspaco(espacoId);

  const desvincularMutation = useDesvincularEquipamentoGenerico();

  const linkedIds
    = allocations?.map(a => a.equipamentoGenerico.id) ?? [];

  const handleDesvincular = (vinculoId: string, nome: string) => {
    toast.promise(
      desvincularMutation.mutateAsync({ vinculoId, espacoId }),
      {
        loading: `Removendo ${nome}...`,
        success: `${nome} removido com sucesso!`,
        error: err => `Erro ao remover: ${err.message}`,
      },
    );
  };

  if (isLoading) {
    return <Skeleton className="h-20 w-full mt-4" />;
  }

  if (isError) {
    return (
      <div className="text-red-500 text-sm mt-4">
        Falha ao carregar equipamentos genéricos.
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold">Equipamentos por Quantidade</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie itens de grande quantidade vinculados a este espaço.
          </p>
        </div>
        <Button type="button" onClick={() => setAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Item
        </Button>
      </div>

      <div className="space-y-2 rounded-lg border p-4 min-h-[100px]">
        {allocations?.length === 0 && (
          <p className="text-center text-sm text-muted-foreground p-4">
            Nenhum equipamento genérico vinculado.
          </p>
        )}

        {allocations?.map(allocation => (
          <div
            key={allocation.id}
            className="flex items-center justify-between p-2 rounded-md hover:bg-accent"
          >
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-muted-foreground" />
              <p className="font-medium text-sm">
                {allocation.equipamentoGenerico.nome}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <QuantityStepper
                vinculoId={allocation.id}
                espacoId={espacoId}
                current={allocation.quantidade}
              />

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Remover ${allocation.equipamentoGenerico.nome}`}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Remover
                      {' '}
                      {allocation.equipamentoGenerico.nome}
                      ?
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <p className="text-sm text-muted-foreground">
                    O vínculo será removido permanentemente. Esta ação não pode
                    ser desfeita.
                  </p>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() =>
                        handleDesvincular(
                          allocation.id,
                          allocation.equipamentoGenerico.nome,
                        )}
                    >
                      Remover
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>

      {isAddDialogOpen && (
        <AddEquipamentoGenericoDialog
          open={isAddDialogOpen}
          onOpenChange={setAddDialogOpen}
          espacoId={espacoId}
          linkedIds={linkedIds}
        />
      )}
    </div>
  );
}
