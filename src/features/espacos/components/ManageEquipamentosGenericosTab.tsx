'use client';

import type { EquipamentoGenerico } from '@/features/equipamentoGenerico/types';
import type { EquipamentoGenericoEspacoCreatePayload } from '@/features/equipamentoGenerico/validation/equipamentoGenericoEspacoSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Package, PlusCircle, Trash2 } from 'lucide-react';
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

type AddEquipamentoGenericoDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  espacoId: string;
  linkedIds: string[];
};

function AddEquipamentoGenericoDialog({
  open,
  onOpenChange,
  espacoId,
  linkedIds,
}: AddEquipamentoGenericoDialogProps) {
  const { data: catalog, isLoading: isLoadingCatalog } = useGetAllEquipamentosGenericos();
  const vincularMutation = useVincularEquipamentoGenerico();

  const form = useForm<EquipamentoGenericoEspacoCreatePayload>({
    resolver: zodResolver(equipamentoGenericoEspacoCreateSchema),
    defaultValues: { equipamentoGenericoId: '', espacoId, quantidade: 1 },
  });

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
                    <Input
                      type="number"
                      min={1}
                      {...field}
                      onChange={e => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <input type="hidden" {...form.register('espacoId')} />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={vincularMutation.isPending || availableItems.length === 0}
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

type QuantityInputProps = {
  vinculoId: string;
  espacoId: string;
  current: number;
};

function QuantityInput({ vinculoId, espacoId, current }: QuantityInputProps) {
  const [value, setValue] = useState(current);
  const atualizarMutation = useAtualizarQuantidade();

  useEffect(() => {
    setValue(current);
  }, [current]);

  const commit = () => {
    if (value === current) {
      return;
    }
    if (!value || value < 1) {
      setValue(current);
      return;
    }
    toast.promise(
      atualizarMutation.mutateAsync({ vinculoId, espacoId, quantidade: value }),
      {
        loading: 'Atualizando quantidade...',
        success: 'Quantidade atualizada!',
        error: (err) => {
          setValue(current); // revert on failure
          return `Erro ao atualizar: ${err.message}`;
        },
      },
    );
  };

  return (
    <Input
      type="number"
      min={1}
      value={value}
      onChange={e => setValue(e.target.valueAsNumber)}
      onBlur={commit}
      className="w-20 text-center"
      disabled={atualizarMutation.isPending}
      aria-label="Quantidade"
    />
  );
}

type ManageEquipamentosGenericosTabProps = {
  espacoId: string;
};

export function ManageEquipamentosGenericosTab({ espacoId }: ManageEquipamentosGenericosTabProps) {
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);

  const { data: allocations, isLoading, isError } = useGetEquipamentosGenericosEspaco(espacoId);
  const desvincularMutation = useDesvincularEquipamentoGenerico();

  const linkedIds = allocations?.map(a => a.equipamentoGenerico.id) ?? [];

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
          <h3 className="text-lg font-semibold">Equipamentos Genéricos</h3>
          <p className="text-sm text-muted-foreground">
            Itens gerenciados por quantidade vinculados a este espaço.
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
              <p className="font-medium text-sm">{allocation.equipamentoGenerico.nome}</p>
            </div>
            <div className="flex items-center gap-3">
              <QuantityInput
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
                    O vínculo será removido permanentemente. Esta ação não pode ser desfeita.
                  </p>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() =>
                        handleDesvincular(allocation.id, allocation.equipamentoGenerico.nome)}
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
