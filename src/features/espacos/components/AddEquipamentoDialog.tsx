'use client';

import type { Equipamento } from '@/features/equipamentos/types';
import { Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  useGetAllEquipamentos,
  useLinkEquipamentosToEspaco,
} from '@/features/equipamentos/services/equipamentoService';
import { EquipamentoStatus } from '@/features/equipamentos/types';

const statusLabel: Record<EquipamentoStatus, string> = {
  [EquipamentoStatus.ATIVO]: 'Ativo',
  [EquipamentoStatus.INATIVO]: 'Inativo',
  [EquipamentoStatus.EM_MANUTENCAO]: 'Em Manutenção',
};

type AddEquipamentoDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  espacoId: string;
  linkedEquipamentoIds: string[];
};

export function AddEquipamentoDialog({
  open,
  onOpenChange,
  espacoId,
  linkedEquipamentoIds,
}: AddEquipamentoDialogProps) {
  const [search, setSearch] = useState('');
  const [selection, setSelection] = useState<Map<string, Equipamento>>(new Map());

  const { data: allEquipamentos, isLoading } = useGetAllEquipamentos();
  const linkMutation = useLinkEquipamentosToEspaco();

  const availableItems = useMemo(() => {
    const unlinked = allEquipamentos?.filter(
      e => !linkedEquipamentoIds.includes(e.id),
    ) ?? [];
    if (!search.trim()) {
      return unlinked;
    }
    const term = search.toLowerCase();
    return unlinked.filter(
      e =>
        e.tombamento.toLowerCase().includes(term)
        || e.tipoEquipamento.nome.toLowerCase().includes(term)
        || (e.descricao ?? '').toLowerCase().includes(term),
    );
  }, [allEquipamentos, linkedEquipamentoIds, search]);

  const toggleItem = (equipamento: Equipamento, checked: boolean) => {
    setSelection((prev) => {
      const next = new Map(prev);
      if (checked) {
        next.set(equipamento.id, equipamento);
      } else {
        next.delete(equipamento.id);
      }
      return next;
    });
  };

  const handleConfirm = () => {
    const selected = Array.from(selection.values());
    if (selected.length === 0) {
      return toast.info('Nenhum item selecionado.');
    }

    const payload = selected.map(e => ({
      tombamento: e.tombamento,
      descricao: e.descricao ?? '',
      statusEquipamento: String(e.status),
      tipoEquipamentoId: e.tipoEquipamento.id,
    }));

    toast.promise(linkMutation.mutateAsync({ espacoId, equipamentos: payload }), {
      loading: 'Vinculando equipamentos...',
      success: () => {
        onOpenChange(false);
        return `${selected.length} equipamento(s) vinculado(s) com sucesso!`;
      },
      error: 'Falha ao vincular equipamentos.',
    });
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSearch('');
      setSelection(new Map());
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg flex flex-col h-[70vh]">
        <DialogHeader>
          <DialogTitle>Adicionar Equipamentos</DialogTitle>
          <DialogDescription>
            Selecione os equipamentos que deseja vincular a este espaço.
          </DialogDescription>
        </DialogHeader>

        <Input
          placeholder="Buscar por tombamento, tipo ou descrição..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="shrink-0"
        />

        <ScrollArea className="flex-1 rounded-md border">
          <div className="p-4 space-y-2">
            {isLoading && (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
              </div>
            )}
            {!isLoading && availableItems.length === 0 && (
              <p className="text-sm text-center text-muted-foreground py-8">
                {allEquipamentos?.length === linkedEquipamentoIds.length
                  ? 'Todos os equipamentos já estão vinculados a este espaço.'
                  : 'Nenhum equipamento encontrado para este filtro.'}
              </p>
            )}
            {availableItems.map(equipamento => (
              <label
                key={equipamento.id}
                htmlFor={`eq-${equipamento.id}`}
                className="flex items-start gap-3 p-2 rounded-md hover:bg-accent cursor-pointer"
              >
                <Checkbox
                  id={`eq-${equipamento.id}`}
                  checked={selection.has(equipamento.id)}
                  onCheckedChange={checked => toggleItem(equipamento, !!checked)}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{equipamento.tombamento}</span>
                    <Badge variant="secondary" className="text-xs">
                      {equipamento.tipoEquipamento.nome}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {statusLabel[equipamento.status] ?? 'Desconhecido'}
                    </Badge>
                  </div>
                  {equipamento.descricao && (
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {equipamento.descricao}
                    </p>
                  )}
                </div>
              </label>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="shrink-0">
          <Button variant="ghost" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={linkMutation.isPending || selection.size === 0}
          >
            {linkMutation.isPending
              ? 'Vinculando...'
              : `Vincular (${selection.size})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
