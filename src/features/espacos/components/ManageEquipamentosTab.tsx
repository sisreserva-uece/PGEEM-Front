'use client';

import { AlertTriangle, HardDrive, PlusCircle, ShieldCheck, Trash2, Wrench, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useUnlinkEquipamentosFromEspaco } from '@/features/equipamentos/services/equipamentoService';
import { EquipamentoStatus } from '@/features/equipamentos/types';
import { AddEquipamentoDialog } from '@/features/espacos/components/AddEquipamentoDialog';
import { useGetLinkedEquipamentos } from '../services/espacoService';

type ManageEquipamentosTabProps = {
  espacoId: string;
};

function UnlinkGenericDialog({ group, onConfirm }: { group: { count: number; items: any[] }; onConfirm: (q: number) => void }) {
  const [quantity, setQuantity] = useState(1);
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-red-500" /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Remover:
            {group.items[0].equipamento.tipoEquipamento.nome}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <p>Quantos itens você deseja desvincular?</p>
        <Input
          type="number"
          value={quantity}
          onChange={e => setQuantity(Number(e.target.value))}
          min="1"
          max={group.count}
        />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => onConfirm(quantity)}>Remover</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const getStatusInfo = (status: EquipamentoStatus) => {
  switch (status) {
    case EquipamentoStatus.ATIVO: return { text: 'Ativo', color: 'bg-green-500', icon: ShieldCheck };
    case EquipamentoStatus.INATIVO: return { text: 'Inativo', color: 'bg-red-500', icon: XCircle };
    case EquipamentoStatus.EM_MANUTENCAO: return { text: 'Manutenção', color: 'bg-yellow-500', icon: Wrench };
    default: return { text: 'Desconhecido', color: 'bg-gray-500', icon: AlertTriangle };
  }
};

export function ManageEquipamentosTab({ espacoId }: ManageEquipamentosTabProps) {
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const { data: linkedEquipamentos, isLoading, isError } = useGetLinkedEquipamentos(espacoId);
  const unlinkMutation = useUnlinkEquipamentosFromEspaco();
  const { specificItems, genericItemsGrouped, linkedSpecificIds } = useMemo(() => {
    const specific: any[] = [];
    const ids: string[] = [];
    const genericMap = new Map<string, { count: number; items: any[] }>();
    linkedEquipamentos?.forEach((link) => {
      if (link.equipamento.tipoEquipamento.isDetalhamentoObrigatorio) {
        specific.push(link);
        ids.push(link.equipamento.id);
      } else {
        const tipoId = link.equipamento.tipoEquipamento.id;
        if (!genericMap.has(tipoId)) {
          genericMap.set(tipoId, { count: 0, items: [] });
        }
        const group = genericMap.get(tipoId)!;
        group.count++;
        group.items.push(link);
      }
    });
    return { specificItems: specific, genericItemsGrouped: Array.from(genericMap.entries()), linkedSpecificIds: ids };
  }, [linkedEquipamentos]);
  const handleUnlinkSpecific = (link: any) => { // Pass the whole link object
    toast.promise(
      unlinkMutation.mutateAsync({
        equipamentoEspacoIds: [link.id],
        espacoId,
        equipamentoIds: [link.equipamento.id],
      }),
      {
        loading: 'Desvinculando equipamento...',
        success: 'Equipamento desvinculado com sucesso!',
        error: 'Erro ao desvincular.',
      },
    );
  };

  const handleUnlinkGeneric = (itemsToUnlink: any[], quantity: number) => {
    if (quantity <= 0 || !itemsToUnlink || itemsToUnlink.length === 0) {
      return;
    }
    const actualItems = itemsToUnlink.slice(0, Math.min(quantity, itemsToUnlink.length));
    const idsToUnlink = actualItems.map(link => link.id);
    const equipamentoIds = actualItems.map(link => link.equipamento.id);
    const promise = unlinkMutation.mutateAsync({
      espacoId,
      equipamentoEspacoIds: idsToUnlink,
      equipamentoIds,
    });
    toast.promise(promise, {
      loading: `Desvinculando ${quantity} item(s)...`,
      success: 'Itens desvinculados com sucesso!',
      error: 'Falha ao desvincular itens.',
    });
  };

  if (isLoading) {
    return <Skeleton className="h-20 w-full mt-4" />;
  }
  if (isError) {
    return <div className="text-red-500">Falha ao carregar equipamentos.</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold">Gerenciar Equipamentos</h3>
          <p className="text-sm text-muted-foreground">Adicione ou remova equipamentos neste espaço.</p>
        </div>
        <Button type="button" onClick={() => setAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Equipamento
        </Button>
      </div>

      <div className="space-y-4 rounded-lg border p-4">
        {specificItems.map((link) => {
          const statusInfo = getStatusInfo(link.equipamento.status);
          const Icon = statusInfo.icon;
          return (
            <div key={link.id} className="flex items-center justify-between p-2 rounded-md hover:bg-accent">
              <div className="flex items-center gap-3">
                <HardDrive className="text-muted-foreground" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{link.equipamento.tombamento}</p>
                    <Badge className={`${statusInfo.color} text-white hover:${statusInfo.color} flex items-center gap-1`}>
                      <Icon className="h-3 w-3" />
                      <span>{statusInfo.text}</span>
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{link.equipamento.descricao}</p>
                </div>
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={() => handleUnlinkSpecific(link)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
            </div>
          );
        })}
        {genericItemsGrouped.map(([tipoId, group]) => {
          return (
            <div key={tipoId} className="flex items-center justify-between p-2 rounded-md hover:bg-accent">
              <div className="flex items-center gap-3">
                <HardDrive className="text-muted-foreground opacity-50" />
                <div>
                  <p className="font-medium">
                    {group.count}
                    x
                    {' '}
                    {group.items[0].equipamento.tipoEquipamento.nome}
                  </p>
                  <p className="text-sm text-muted-foreground">Item genérico</p>
                </div>
              </div>
              <UnlinkGenericDialog
                group={group}
                onConfirm={quantity => handleUnlinkGeneric(group.items, quantity)}
              />
            </div>
          );
        })}
        {linkedEquipamentos?.length === 0 && <p className="text-center text-muted-foreground p-4">Nenhum equipamento vinculado.</p>}
      </div>
      {isAddDialogOpen && (
        <AddEquipamentoDialog
          open={isAddDialogOpen}
          onOpenChange={setAddDialogOpen}
          espacoId={espacoId}
          linkedSpecificIds={linkedSpecificIds}
        />
      )}
    </div>
  );
}
