// In src/features/complexos/components/ManageEspacosTab.tsx
'use client';

import { PlusCircle, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAddEspacoToComplexo, useGetAllEspacos, useGetLinkedEspacos, useRemoveEspacoFromComplexo } from '../services/complexoService';

type ManageEspacosTabProps = {
  complexoId: string;
};

export function ManageEspacosTab({ complexoId }: ManageEspacosTabProps) {
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const { data: linkedEspacos, isLoading: isLoadingLinked } = useGetLinkedEspacos(complexoId);
  const { data: allEspacos } = useGetAllEspacos();
  const addMutation = useAddEspacoToComplexo();
  const removeMutation = useRemoveEspacoFromComplexo();
  const linkedEspacoIds = useMemo(() => linkedEspacos?.map(espaco => espaco.id) ?? [], [linkedEspacos]);
  const availableEspacos = useMemo(() => {
    if (!allEspacos) {
      return [];
    }
    return allEspacos.filter(espaco => !linkedEspacoIds.includes(espaco.id));
  }, [allEspacos, linkedEspacoIds]);

  const handleAddEspaco = (espacoId: string) => {
    toast.promise(addMutation.mutateAsync({ complexoId, espacoId }), {
      loading: 'Vinculando espaço...',
      success: 'Espaço vinculado com sucesso!',
      error: 'Erro ao vincular espaço.',
    });
    setAddDialogOpen(false);
  };

  const handleRemoveEspaco = (espacoId: string) => {
    toast.promise(removeMutation.mutateAsync({ complexoId, espacoId }), {
      loading: 'Removendo vínculo...',
      success: 'Vínculo removido com sucesso!',
      error: 'Erro ao remover vínculo.',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Espaço
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Espaço ao Complexo</DialogTitle>
              <DialogDescription>Selecione um espaço da lista para vincular.</DialogDescription>
            </DialogHeader>
            <Command>
              <CommandInput placeholder="Buscar espaço..." />
              <CommandList className="max-h-[300px]">
                <CommandEmpty>Nenhum espaço encontrado ou todos já foram vinculados.</CommandEmpty>
                <CommandGroup>
                  {availableEspacos.map(espaco => (
                    <CommandItem key={espaco.id} onSelect={() => handleAddEspaco(espaco.id)}>
                      {espaco.nome}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border min-h-[200px]">
        {isLoadingLinked
          ? (
              <p className="p-4 text-center text-muted-foreground">Carregando...</p>
            )
          : linkedEspacos && linkedEspacos.length > 0
            ? (
                <ul className="divide-y">
                  {linkedEspacos.map(espaco => (
                    <li key={espaco.id} className="flex items-center justify-between p-3">
                      <div>
                        <p className="font-medium">{espaco.nome}</p>
                        <p className="text-sm text-muted-foreground">{espaco.departamento.nome}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveEspaco(espaco.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )
            : (
                <p className="p-4 text-center text-muted-foreground">Nenhum espaço vinculado a este complexo.</p>
              )}
      </div>
    </div>
  );
}
