'use client';

import { AlertTriangle, PlusCircle, RefreshCw, Trash2, User } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAddGestorToEspaco, useGetEspacoGestores, useRemoveGestorFromEspaco } from '../services/espacoService';
import { AddGestorDialog } from './AddGestorDialog';

type ManageGestoresTabProps = {
  espacoId: string;
};

export function ManageGestoresTab({ espacoId }: ManageGestoresTabProps) {
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const { data: gestores, isLoading, isError } = useGetEspacoGestores(espacoId);
  const removeMutation = useRemoveGestorFromEspaco();
  const addMutation = useAddGestorToEspaco();
  const activeGestores = gestores?.filter(link => link.estaAtivo) ?? [];
  const inactiveGestores = gestores?.filter(link => !link.estaAtivo) ?? [];

  const handleRemove = (linkId: string) => {
    const promise = removeMutation.mutateAsync({ linkId, espacoId });
    toast.promise(promise, {
      loading: 'Desativando gestor...',
      success: 'Gestor desativado com sucesso!',
      error: 'Erro ao desativar gestor.',
    });
  };

  const handleReactivate = (usuarioGestorId: string) => {
    toast.promise(
      addMutation.mutateAsync({ espacoId, usuarioGestorId }),
      {
        loading: 'Reativando gestor...',
        success: 'Gestor reativado com sucesso!',
        error: 'Erro ao reativar gestor.',
      },
    );
  };

  const currentGestorIds = activeGestores.map(link => link.gestor.id);

  if (isLoading) {
    return (
      <div className="space-y-2 mt-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="text-red-500 flex items-center gap-2 mt-4">
        <AlertTriangle size={18} />
        {' '}
        Falha ao carregar gestores.
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold">Gerenciar Gestores</h3>
          <p className="text-sm text-muted-foreground">Adicione ou remova gestores associados a este espaço.</p>
        </div>
        <Button type="button" onClick={() => setAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Gestor
        </Button>
      </div>

      <Tabs defaultValue="ativos" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ativos">Ativos</TabsTrigger>
          <TabsTrigger value="inativos">Inativos</TabsTrigger>
        </TabsList>

        <TabsContent value="ativos" className="mt-4">
          <div className="space-y-2 rounded-lg border p-2">
            {activeGestores.length > 0
              ? (
                  activeGestores.map(link => (
                    <div key={link.id} className="flex items-center justify-between p-2 rounded-md hover:bg-accent">
                      <div className="flex items-center gap-3">
                        {' '}
                        <User className="text-muted-foreground" />
                        {' '}
                        <div>
                          {' '}
                          <p className="font-medium">{link.gestor.nome}</p>
                          {' '}
                          <p className="text-sm text-muted-foreground">{link.gestor.email}</p>
                          {' '}
                        </div>
                        {' '}
                      </div>
                      <Button type="button" variant="ghost" size="icon" onClick={() => handleRemove(link.id)} disabled={removeMutation.isPending}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))
                )
              : <p className="text-center text-muted-foreground p-4">Nenhum gestor ativo.</p>}
          </div>
        </TabsContent>

        <TabsContent value="inativos" className="mt-4">
          <div className="space-y-2 rounded-lg border p-2">
            {
              inactiveGestores.length > 0
                ? (
                    inactiveGestores.map(link => (
                      <div key={link.id} className="flex items-center justify-between p-2 rounded-md hover:bg-accent opacity-60">
                        <div className="flex items-center gap-3">
                          {' '}
                          <User className="text-muted-foreground" />
                          {' '}
                          <div>
                            {' '}
                            <p className="font-medium">{link.gestor.nome}</p>
                            {' '}
                            <p className="text-sm text-muted-foreground">{link.gestor.email}</p>
                            {' '}
                          </div>
                          {' '}
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => handleReactivate(link.gestor.id)} disabled={addMutation.isPending}>
                          <RefreshCw className="h-4 w-4 text-blue-500" />
                        </Button>
                      </div>
                    ))
                  )
                : <p className="text-center text-muted-foreground p-4">Nenhum gestor inativo.</p>
            }
          </div>
        </TabsContent>
      </Tabs>

      <AddGestorDialog
        open={isAddDialogOpen}
        onOpenChange={setAddDialogOpen}
        espacoId={espacoId}
        existingGestorIds={currentGestorIds}
      />
    </div>
  );
}
