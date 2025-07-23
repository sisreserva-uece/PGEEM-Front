'use client';

import type { Espaco } from '@/features/espacos/types';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { EspacoForm } from './EspacoForm';

type ManageEspacoSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  espaco?: Espaco | null;
};

export function ManageEspacoSheet({ open, onOpenChange, espaco }: ManageEspacoSheetProps) {
  const isEditMode = !!espaco;
  const handleSuccess = () => {
    onOpenChange(false);
  };
  const formKey = espaco ? espaco.id : 'new-espaco';
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditMode ? 'Editar Espaço' : 'Criar Novo Espaço'}</SheetTitle>
          <SheetDescription>
            {isEditMode
              ? 'Atualize as informações do espaço abaixo.'
              : 'Preencha os detalhes para registrar um novo espaço.'}
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <EspacoForm key={formKey} espaco={espaco} onSuccess={handleSuccess} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
