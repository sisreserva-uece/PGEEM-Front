'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';

type MasterDetailSheetProps<T> = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entity?: T | null;
  entityName: string;
  initialMode?: 'view' | 'edit';
  canEdit: boolean;
  ViewComponent: React.ComponentType<{ entity: T }>;
  FormComponent: React.ComponentType<{ entity?: T | null; onSuccess: () => void }>;
};

export function MasterDetailSheet<T>({
  open,
  onOpenChange,
  entity,
  entityName,
  initialMode = 'edit',
  canEdit,
  ViewComponent,
  FormComponent,
}: MasterDetailSheetProps<T>) {
  const [mode, setMode] = useState(entity ? initialMode : 'edit');
  const isCreateMode = !entity;
  const isEditMode = mode === 'edit';
  const handleClose = () => onOpenChange(false);
  const getTitle = () => {
    if (isCreateMode) {
      return `Criar Novo ${entityName}`;
    }
    return isEditMode ? `Editar ${entityName}` : `Detalhes do ${entityName}`;
  };
  const getDescription = () => {
    if (isCreateMode) {
      return `Preencha os detalhes para registrar um novo ${entityName}.`;
    }
    return isEditMode
      ? `Atualize as informações do ${entityName} abaixo.`
      : `Visualize as informações. Clique em "Editar" para modificar.`;
  };
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setMode(entity ? initialMode : 'edit');
    }
    onOpenChange(isOpen);
  };
  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full sm:max-w-3xl flex flex-col">
        <SheetHeader>
          <SheetTitle>{getTitle()}</SheetTitle>
          <SheetDescription>{getDescription()}</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isEditMode
            ? (
                <FormComponent entity={entity} onSuccess={handleClose} />
              )
            : (
                entity && <ViewComponent entity={entity} />
              )}
        </div>
        <SheetFooter className="px-6 py-4 border-t">
          {mode === 'view'
            ? (
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={handleClose}>Fechar</Button>
                  {canEdit && <Button onClick={() => setMode('edit')}>Editar</Button>}
                </div>
              )
            : (
                <div className="flex justify-end">
                  {entity && <Button variant="ghost" type="button" onClick={() => setMode('view')}>Cancelar</Button>}
                </div>
              )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
