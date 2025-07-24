'use client';

import type { Equipamento, TipoEquipamento } from '../types';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetEquipamentosByTipo } from '../services/espacoService';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tipo: TipoEquipamento;
  linkedSpecificIds: string[];
  onConfirm: (items: Equipamento[]) => void;
};

export function SelectSpecificEquipamentoDialog({ open, onOpenChange, tipo, linkedSpecificIds, onConfirm }: Props) {
  const { data: items, isLoading } = useGetEquipamentosByTipo(tipo.id);
  const [selection, setSelection] = useState<Map<string, Equipamento>>(new Map());

  const availableItems = items?.filter(item => !linkedSpecificIds.includes(item.id)) ?? [];

  const handleConfirm = () => {
    onConfirm(Array.from(selection.values()));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg h-[70vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            Selecionar:
            {' '}
            {' '}
            {tipo.nome}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 rounded-md border">
          <div className="p-4 space-y-2">
            {isLoading && <Loader2 className="animate-spin mx-auto" />}
            {availableItems.map(item => (
              <div key={item.id} className="flex items-center gap-3">
                <Checkbox
                  id={`sel-${item.id}`}
                  checked={selection.has(item.id)}
                  onCheckedChange={(checked) => {
                    const newMap = new Map(selection);
                    if (checked) {
                      newMap.set(item.id, item);
                    } else {
                      newMap.delete(item.id);
                    }
                    setSelection(newMap);
                  }}
                />
                <label htmlFor={`sel-${item.id}`}>
                  <p>{item.tombamento}</p>
                  <p className="text-sm text-muted-foreground">{item.descricao}</p>
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleConfirm}>
            Adicionar Selecionados (
            {selection.size}
            )
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
