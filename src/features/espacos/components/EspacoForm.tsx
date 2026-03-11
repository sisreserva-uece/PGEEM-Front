'use client';

import type { Espaco } from '@/features/espacos/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserAccess } from '@/features/auth/hooks/useUserAccess';
import { ManageEquipamentosGenericosTab } from '@/features/espacos/components/ManageEquipamentosGenericosTab';
import { ManageEquipamentosTab } from '@/features/espacos/components/ManageEquipamentosTab';
import { ManageGestoresTab } from '@/features/espacos/components/ManageGestoresTab';
import { ManageRelatoriosTab } from '@/features/espacos/components/ManageRelatoriosTab';
import { EspacoDetailsForm } from './EspacoDetailsForm';

type EspacoFormProps = {
  entity?: Espaco | null;
  onSuccess: () => void;
};

export function EspacoForm({ entity: espaco, onSuccess }: EspacoFormProps) {
  const isEditMode = !!espaco;
  const access = useUserAccess(espaco);

  return (
    <Tabs defaultValue="dados-principais" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="dados-principais">Dados Principais</TabsTrigger>
        <TabsTrigger value="gestores" disabled={!isEditMode || !access.canManageEspacoGestores}>
          Gestores
        </TabsTrigger>
        <TabsTrigger value="equipamentos" disabled={!isEditMode || !access.canManageEspacoEquipamentos}>
          Equipamentos
        </TabsTrigger>
        <TabsTrigger value="equipamentos-genericos" disabled={!isEditMode || !access.canManageEspacoEquipamentos}>
          Eq. Genéricos
        </TabsTrigger>
        <TabsTrigger value="espaco-relatorio" disabled={!isEditMode || !access.canManageRelatorioEquipamentos}>
          Relatório
        </TabsTrigger>
      </TabsList>

      <TabsContent value="dados-principais" className="mt-6">
        <EspacoDetailsForm entity={espaco} onSuccess={onSuccess} />
      </TabsContent>

      <TabsContent value="gestores" className="mt-4">
        {isEditMode && espaco
          ? <ManageGestoresTab espacoId={espaco.id} />
          : <p className="text-center text-muted-foreground p-4">Salve o espaço primeiro para poder adicionar gestores.</p>}
      </TabsContent>

      <TabsContent value="equipamentos" className="mt-4">
        {isEditMode && espaco
          ? <ManageEquipamentosTab espacoId={espaco.id} />
          : <p className="text-center text-muted-foreground p-4">Salve o espaço primeiro para poder adicionar equipamentos.</p>}
      </TabsContent>

      <TabsContent value="equipamentos-genericos" className="mt-4">
        {isEditMode && espaco
          ? (
              <ManageEquipamentosGenericosTab
                espacoId={espaco.id}
                canEdit={access.canManageEspacoEquipamentos}
              />
            )
          : <p className="text-center text-muted-foreground p-4">Salve o espaço primeiro para poder adicionar equipamentos genéricos.</p>}
      </TabsContent>

      <TabsContent value="espaco-relatorio" className="mt-4">
        {isEditMode && espaco
          ? <ManageRelatoriosTab espacoId={espaco.id} />
          : <p className="text-center text-muted-foreground p-4">Salve o espaço primeiro para poder adicionar relatórios.</p>}
      </TabsContent>
    </Tabs>
  );
}
