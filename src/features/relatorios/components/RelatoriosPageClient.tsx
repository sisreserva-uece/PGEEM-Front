'use client';

import { Download } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RelatorioConfigDialog } from './RelatorioConfigDialog';
import { RelatorioEspacosTab } from './RelatoriosEspacosTab';
import { RelatorioEquipamentosTab } from './RelatoriosEquipamentosTab';
import { useUserAccess } from '@/features/auth/hooks/useUserAccess';

export function RelatoriosPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const access = useUserAccess();
  
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);

  const activeTab = searchParams.get('tab') === 'equipamentos' ? 'equipamentos' : 'espacos';

  const handleTabChange = (tab: string) => {
    router.push(`/dashboard/relatorios?tab=${tab}`);
    setSelectedIds([]);
    setSelectedNames([]);
  };

  const handleSelectionChange = (ids: string[], nomes: string[]) => {
    setSelectedIds(ids);
    setSelectedNames(nomes);
  };

  if (access.isLoading) return <div className="p-8">Carregando permissões...</div>;
  if (!access.isAdmin) return null;

  return (
    <div className="h-full flex-1 flex-col space-y-4 p-4 md:p-8 md:flex">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gerenciar Relatórios</h2>
          <p className="text-muted-foreground">
            Selecione os itens e configure a exportação dos dados.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={() => setIsConfigOpen(true)}
            className="bg-[#10B981] hover:bg-[#059669] text-white font-bold"
            disabled={selectedIds.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Gerar Relatório ({selectedIds.length})
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="espacos">Relatórios Espaços</TabsTrigger>
          <TabsTrigger value="equipamentos">Relatórios Equipamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="espacos" className="mt-4">
          <RelatorioEspacosTab onSelectionChange={handleSelectionChange} />
        </TabsContent>

        <TabsContent value="equipamentos" className="mt-4">
          <RelatorioEquipamentosTab onSelectionChange={handleSelectionChange} />
        </TabsContent>
      </Tabs>

      <RelatorioConfigDialog 
        isOpen={isConfigOpen} 
        onOpenChange={setIsConfigOpen}
        tipo={activeTab}
        idsSelecionados={selectedIds || []}
        listaNomes={selectedNames || []}
      />
    </div>
  );
}