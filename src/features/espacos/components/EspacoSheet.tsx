'use client';

import type { Espaco } from '@/features/espacos/types';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { EspacoForm } from './EspacoForm';
import { EspacoView } from './EspacoView';

type EspacoSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  espaco?: Espaco | null;
  initialMode?: 'view' | 'edit';
};

export function EspacoSheet({ open, onOpenChange, espaco, initialMode = 'edit' }: EspacoSheetProps) {
  const [mode, setMode] = useState(espaco ? initialMode : 'edit');
  const isEditMode = mode === 'edit';
  const isCreateMode = !espaco;

  const handleClose = () => onOpenChange(false);
  const getTitle = () => {
    if (isCreateMode) {
      return 'Criar Novo Espaço';
    }
    return isEditMode ? 'Editar Espaço' : 'Detalhes do Espaço';
  };
  const getDescription = () => {
    if (isCreateMode) {
      return 'Preencha os detalhes para registrar um novo espaço.';
    }
    return isEditMode
      ? 'Atualize as informações e relações do espaço abaixo.'
      : 'Visualize as informações do espaço. Clique em "Editar" para modificar.';
  };
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-3xl flex flex-col">
        <SheetHeader>
          <SheetTitle>{getTitle()}</SheetTitle>
          <SheetDescription>{getDescription()}</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isEditMode || isCreateMode
            ? (
                <EspacoForm key={espaco?.id ?? 'new'} espaco={espaco} onSuccess={handleClose} />
              )
            : (
                <EspacoView espaco={espaco!} />
              )}
        </div>
        <SheetFooter className="px-6 py-4 border-t">
          {mode === 'view'
            ? (
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={handleClose}>Fechar</Button>
                  <Button onClick={() => setMode('edit')}>Editar</Button>
                </div>
              )
            : (
                <div className="flex justify-end">
                  <Button variant="ghost" onClick={handleClose}>Cancelar</Button>
                </div>
              )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
