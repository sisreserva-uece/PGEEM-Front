'use client';

import type { Espaco } from '../types';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserAccess } from '@/features/auth/hooks/useUserAccess';
import { useGetManagedEspacosForCurrentUser } from '@/features/espacos/services/espacoService';
import { SolicitacoesPendentesTab } from '@/features/reservas/components/SolicitacoesPendentesTab'; // <-- IMPORT THE NEW COMPONENT
import { cn } from '@/lib/utils';
import { EspacoDetailsForm } from './EspacoDetailsForm';
import { ManageEquipamentosTab } from './ManageEquipamentosTab';
import { ManageGestoresTab } from './ManageGestoresTab';

export function MeusEspacosPageClient() {
  const { data: managedEspacosLinks, isLoading } = useGetManagedEspacosForCurrentUser();
  const [selectedEspaco, setSelectedEspaco] = useState<Espaco | null>(null);

  const managedEspacos = useMemo(() => managedEspacosLinks?.map(link => link.espaco) || [], [managedEspacosLinks]);
  const access = useUserAccess(selectedEspaco);

  useEffect(() => {
    if (!selectedEspaco && managedEspacos.length > 0) {
      setSelectedEspaco(managedEspacos[0]);
    }
  }, [managedEspacos, selectedEspaco]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin h-8 w-8" /></div>;
  }

  const handleSuccess = () => {
    // Invalidate queries if needed, e.g., refetch managed espacos list if name changes
  };

  return (
    <div className="h-full flex-1 flex-col md:flex">
      <ResizablePanelGroup direction="horizontal" className="h-full max-h-[calc(100vh-180px)] rounded-lg border">
        <ResizablePanel defaultSize={25} minSize={20} maxSize={30}>
          <div className="flex flex-col h-full p-2">
            <h3 className="text-lg font-bold tracking-tight p-2">Meus Espaços</h3>
            <ScrollArea>
              <div className="flex flex-col gap-1">
                {managedEspacos.map(espaco => (
                  <button
                    key={espaco.id}
                    onClick={() => setSelectedEspaco(espaco)}
                    className={cn(
                      'w-full text-left p-2 rounded-md text-sm hover:bg-accent',
                      selectedEspaco?.id === espaco.id && 'bg-accent font-semibold',
                    )}
                  >
                    {espaco.nome}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75}>
          <ScrollArea className="h-full">
            <div className="p-4 md:p-6">
              {selectedEspaco
                ? (
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight">{selectedEspaco.nome}</h2>
                      <p className="text-muted-foreground mb-6">Gerencie as solicitações, informações e recursos do seu espaço.</p>
                      <Tabs defaultValue="solicitacoes" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="solicitacoes">Solicitações</TabsTrigger>
                          <TabsTrigger value="informacoes">Informações</TabsTrigger>
                          <TabsTrigger value="equipamentos">Equipamentos</TabsTrigger>
                          <TabsTrigger value="gestores" disabled={!access.canManageEspacoGestores}>Gestores</TabsTrigger>
                        </TabsList>

                        <TabsContent value="solicitacoes" className="mt-6">
                          <SolicitacoesPendentesTab espaco={selectedEspaco} />
                        </TabsContent>

                        <TabsContent value="informacoes" className="mt-6">
                          <EspacoDetailsForm entity={selectedEspaco} onSuccess={handleSuccess} />
                        </TabsContent>

                        <TabsContent value="equipamentos" className="mt-6">
                          <ManageEquipamentosTab espacoId={selectedEspaco.id} />
                        </TabsContent>

                        <TabsContent value="gestores" className="mt-6">
                          <ManageGestoresTab espacoId={selectedEspaco.id} />
                        </TabsContent>

                      </Tabs>
                    </div>
                  )
                : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">Selecione um espaço para gerenciar.</p>
                    </div>
                  )}
            </div>
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
