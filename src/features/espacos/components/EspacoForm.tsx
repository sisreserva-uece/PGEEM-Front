'use client';

import type { Espaco } from '@/features/espacos/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserAccess } from '@/features/auth/hooks/useUserAccess';
import { ManageEquipamentosTab } from '@/features/espacos/components/ManageEquipamentosTab';
import { ManageGestoresTab } from '@/features/espacos/components/ManageGestoresTab';
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
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="dados-principais">Dados Principais</TabsTrigger>
        <TabsTrigger value="gestores" disabled={!isEditMode || !access.canManageEspacoGestores}>Gestores</TabsTrigger>
        <TabsTrigger value="equipamentos" disabled={!isEditMode || !access.canManageEspacoEquipamentos}>Equipamentos</TabsTrigger>
      </TabsList>

      <TabsContent value="dados-principais" className="mt-6">
        <EspacoDetailsForm entity={espaco} onSuccess={onSuccess} />
      </TabsContent>

      <TabsContent value="gestores" className="mt-4">
        {isEditMode && espaco ? <ManageGestoresTab espacoId={espaco.id} /> : <p className="text-center text-muted-foreground p-4">Salve o espaço primeiro para poder adicionar gestores.</p>}
      </TabsContent>

      <TabsContent value="equipamentos" className="mt-4">
        {isEditMode && espaco ? <ManageEquipamentosTab espacoId={espaco.id} /> : <p className="text-center text-muted-foreground p-4">Salve o espaço primeiro para poder adicionar equipamentos.</p>}
      </TabsContent>
    </Tabs>
  );
}
