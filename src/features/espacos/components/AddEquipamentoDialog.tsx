'use client';

import type { Equipamento, TipoEquipamento } from '@/features/equipamentos/types';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  useGetAllTiposEquipamento,
  useLinkEquipamentosToEspaco,
} from '@/features/equipamentos/services/equipamentoService';
import { EquipamentoStatus } from '@/features/equipamentos/types';
import { useDebounce } from '@/lib/hooks/useDebounce';

import { SelectSpecificEquipamentoDialog } from './SelectSpecificEquipamentoDialog';

type AddEquipamentoDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  espacoId: string;
  linkedSpecificIds: string[];
};

type PendingLink = { id: string } & ({
  type: 'specific';
  item: Equipamento;
} | {
  type: 'generic';
  tipo: TipoEquipamento;
  quantity: number;
});

export function AddEquipamentoDialog({ open, onOpenChange, espacoId, linkedSpecificIds }: AddEquipamentoDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [pendingLinks, setPendingLinks] = useState<PendingLink[]>([]);
  const [specificSelectionState, setSpecificSelectionState] = useState<{ open: boolean; tipo: TipoEquipamento | null }>({ open: false, tipo: null });
  const { data: uniqueTipos, isLoading } = useGetAllTiposEquipamento({ search: debouncedSearchTerm });
  const linkMutation = useLinkEquipamentosToEspaco();
  const addGenericLink = (tipo: TipoEquipamento, quantity: number) => {
    if (quantity > 0) {
      setPendingLinks(prev => [...prev, { id: tipo.id, type: 'generic', tipo, quantity }]);
    }
  };
  const groupedPendingLinks = useMemo(() => {
    const groups = new Map<string, { tipo: TipoEquipamento; items: PendingLink[] }>();
    pendingLinks.forEach((link) => {
      const tipo = link.type === 'specific' ? link.item.tipoEquipamento : link.tipo;
      if (!groups.has(tipo.id)) {
        groups.set(tipo.id, { tipo, items: [] });
      }
      groups.get(tipo.id)!.items.push(link);
    });
    return Array.from(groups.values());
  }, [pendingLinks]);
  useEffect(() => {
    if (open) {
      setSearchTerm('');
      setPendingLinks([]);
    }
  }, [open]);
  const addSpecificLinks = (items: Equipamento[]) => {
    const newLinks = items.map(item => ({ id: item.id, type: 'specific' as const, item }));
    setPendingLinks(prev => [...prev, ...newLinks]);
  };
  const handleLink = () => {
    const payload = pendingLinks.flatMap((link) => {
      if (link.type === 'specific') {
        return {
          tombamento: link.item.tombamento,
          descricao: link.item.descricao,
          statusEquipamento: String(link.item.status),
          tipoEquipamentoId: link.item.tipoEquipamento.id,
        };
      }
      return Array.from({ length: link.quantity }, () => ({
        tombamento: '',
        descricao: '',
        statusEquipamento: String(EquipamentoStatus.ATIVO),
        tipoEquipamentoId: link.tipo.id,
      }));
    });
    if (payload.length === 0) {
      return toast.info('Nenhum item adicionado.');
    }
    toast.promise(linkMutation.mutateAsync({ espacoId, equipamentos: payload }), {
      loading: 'Vinculando...',
      success: () => {
        onOpenChange(false);
        return 'Equipamentos vinculados!';
      },
      error: 'Falha ao vincular.',
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-4xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Adicionar Equipamentos</DialogTitle>
            <DialogDescription>Primeiro, adicione itens à sua lista. Depois, clique em "Vincular Itens" para salvar.</DialogDescription>
          </DialogHeader>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
            <div className="flex flex-col gap-2 overflow-hidden">
              <Input placeholder="Pesquisar tipo de equipamento..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              <ScrollArea className="flex-1 rounded-md border">
                <div className="p-4 space-y-2">
                  {isLoading && <Loader2 className="animate-spin mx-auto" />}
                  {!isLoading && uniqueTipos?.map(tipo => (
                    <div key={tipo.id} className="flex items-center justify-between">
                      <span>{tipo.nome}</span>
                      {tipo.isDetalhamentoObrigatorio
                        ? (
                            <Button size="sm" variant="outline" onClick={() => setSpecificSelectionState({ open: true, tipo })}>
                              Selecionar Específicos
                            </Button>
                          )
                        : (
                            <AddGenericButton onAdd={quantity => addGenericLink(tipo, quantity)} />
                          )}
                    </div>
                  ))}
                  {!isLoading && uniqueTipos?.length === 0 && (
                    <p className="text-sm text-center text-muted-foreground">Nenhum tipo encontrado.</p>
                  )}
                </div>
              </ScrollArea>
            </div>
            <div className="flex flex-col gap-2 overflow-hidden">
              <h3 className="font-semibold">
                Itens a Adicionar
              </h3>
              <ScrollArea className="flex-1 rounded-md border">
                <div className="p-4 space-y-4">
                  {pendingLinks.length === 0 && <p className="text-sm text-center text-muted-foreground">Nenhum item na lista.</p>}
                  {groupedPendingLinks.map((group) => {
                    const totalQuantity = group.items.reduce((sum, link) => {
                      return sum + (link.type === 'generic' ? link.quantity : 1);
                    }, 0);
                    return (
                      <div key={group.tipo.id}>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold text-sm">{group.tipo.nome}</h4>
                          <span className="text-sm font-bold text-muted-foreground">
                            {totalQuantity}
                            {' '}
                            item(s)
                          </span>
                        </div>
                        <div className="pl-4 space-y-1">
                          {group.items.map(link => (
                            <div key={link.id} className="flex items-center justify-between text-sm">
                              <span>
                                {link.type === 'generic'
                                  ? `${link.quantity}x (Genérico)`
                                  : `${link.item.tombamento}`}
                              </span>
                              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setPendingLinks(p => p.filter(l => l.id !== link.id))}>
                                <Trash2 className="h-3 w-3 text-red-500" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <Separator className="mt-4" />
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button onClick={handleLink} disabled={linkMutation.isPending || pendingLinks.length === 0}>
              Vincular Itens
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {specificSelectionState.tipo && (
        <SelectSpecificEquipamentoDialog
          key={specificSelectionState.tipo.id}
          open={specificSelectionState.open}
          onOpenChange={isOpen => setSpecificSelectionState({ ...specificSelectionState, open: isOpen })}
          tipo={specificSelectionState.tipo}
          linkedSpecificIds={linkedSpecificIds}
          onConfirm={addSpecificLinks}
        />
      )}
    </>
  );
}

function AddGenericButton({ onAdd }: { onAdd: (q: number) => void }) {
  const [quantity, setQuantity] = useState(1);
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="outline"><PlusCircle className="h-4 w-4" /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader><AlertDialogTitle>Adicionar Itens Genéricos</AlertDialogTitle></AlertDialogHeader>
        <div className="flex items-center gap-2">
          <label htmlFor="quantity">Quantidade:</label>
          <Input id="quantity" type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} min="1" />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => onAdd(quantity)}>Adicionar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
