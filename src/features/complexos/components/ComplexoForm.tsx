'use client';

import type { Complexo } from '../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserAccess } from '@/features/auth/hooks/useUserAccess';
import { ComplexoDetailsForm } from './ComplexoDetailsForm';
import { ManageEspacosTab } from './ManageEspacosTab';

type ComplexoFormProps = {
  entity?: Complexo | null;
  onSuccess: () => void;
};

export function ComplexoForm({ entity: complexo, onSuccess }: ComplexoFormProps) {
  const isEditMode = !!complexo;
  const access = useUserAccess();

  return (
    <Tabs defaultValue="dados-principais" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="dados-principais">Dados Principais</TabsTrigger>
        <TabsTrigger value="espacos" disabled={!isEditMode || !access.canManageComplexos}>
          Espaços Vinculados
        </TabsTrigger>
      </TabsList>

      <TabsContent value="dados-principais" className="mt-6">
        <ComplexoDetailsForm entity={complexo} onSuccess={onSuccess} />
      </TabsContent>

      <TabsContent value="espacos" className="mt-4">
        {isEditMode && complexo
          ? (
              <ManageEspacosTab complexoId={complexo.id} />
            )
          : (
              <p className="text-center text-muted-foreground p-4">
                Salve o complexo primeiro para poder adicionar espaços.
              </p>
            )}
      </TabsContent>
    </Tabs>
  );
}
