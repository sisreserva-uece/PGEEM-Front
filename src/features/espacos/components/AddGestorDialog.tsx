'use client';

import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { useAddGestorToEspaco, useGetUsuarios } from '../services/espacoService';

type AddGestorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  espacoId: string;
  existingGestorIds: string[];
};

export function AddGestorDialog({ open, onOpenChange, espacoId, existingGestorIds }: AddGestorDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { data: usersData, isLoading } = useGetUsuarios({ nome: debouncedSearchTerm, size: 20 });
  const addMutation = useAddGestorToEspaco();
  const handleAdd = (usuarioId: string) => {
    toast.promise(addMutation.mutateAsync({ espacoId, usuarioGestorId: usuarioId }), {
      loading: 'Adicionando gestor...',
      success: 'Gestor adicionado com sucesso!',
      error: 'Erro ao adicionar gestor.',
    });
  };
  const availableUsers = usersData?.content.filter(user => !existingGestorIds.includes(user.id));
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Gestor</DialogTitle>
        </DialogHeader>
        <div className="p-1">
          <Input
            placeholder="Pesquisar por nome..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <ScrollArea className="h-72 w-full rounded-md border">
          <div className="p-4 space-y-2">
            {isLoading && <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>}
            {!isLoading && availableUsers && availableUsers.length > 0
              ? (
                  availableUsers.map(user => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{user.nome}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAdd(user.id)}
                        disabled={addMutation.isPending && addMutation.variables?.usuarioGestorId === user.id}
                      >
                        Adicionar
                      </Button>
                    </div>
                  ))
                )
              : (
                  !isLoading && <p className="text-center text-muted-foreground">Nenhum usuário encontrado.</p>
                )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
