'use client';

import { AlertTriangle, HardDrive, PlusCircle, ShieldCheck, Trash2, Wrench, XCircle } from 'lucide-react';
import { useState } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';
import { useUnlinkEquipamentosFromEspaco } from '@/features/equipamentos/services/equipamentoService';
import { EquipamentoStatus } from '@/features/equipamentos/types';
import { AddEquipamentoDialog } from '@/features/espacos/components/AddEquipamentoDialog';
import { useGetLinkedEquipamentos } from '../services/espacoService';

type ManageEquipamentosTabProps = {
  espacoId: string;
};

const getStatusInfo = (status: EquipamentoStatus) => {
  switch (status) {
    case EquipamentoStatus.ATIVO:
      return { text: 'Ativo', color: 'bg-green-500', icon: ShieldCheck };
    case EquipamentoStatus.INATIVO:
      return { text: 'Inativo', color: 'bg-red-500', icon: XCircle };
    case EquipamentoStatus.EM_MANUTENCAO:
      return { text: 'Manutenção', color: 'bg-yellow-500', icon: Wrench };
    default:
      return { text: 'Desconhecido', color: 'bg-gray-500', icon: AlertTriangle };
  }
};

export function ManageEquipamentosTab({ espacoId }: ManageEquipamentosTabProps) {
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const { data: linkedEquipamentos, isLoading, isError } = useGetLinkedEquipamentos(espacoId);
  const unlinkMutation = useUnlinkEquipamentosFromEspaco();
  const linkedEquipamentoIds = linkedEquipamentos?.map(link => link.equipamento.id) ?? [];
  const handleUnlink = (link: any) => {
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
          <h3 className="text-lg font-semibold">Equipamentos</h3>
          <p className="text-sm text-muted-foreground">
            Itens individualmente identificados vinculados a este espaço.
          </p>
        </div>
        <Button type="button" onClick={() => setAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Equipamento
        </Button>
      </div>

      <div className="space-y-2 rounded-lg border p-4 min-h-[100px]">
        {linkedEquipamentos?.length === 0 && (
          <p className="text-center text-muted-foreground p-4">
            Nenhum equipamento vinculado.
          </p>
        )}
        {linkedEquipamentos?.map((link) => {
          const statusInfo = getStatusInfo(link.equipamento.status);
          const Icon = statusInfo.icon;
          return (
            <div
              key={link.id}
              className="flex items-center justify-between p-2 rounded-md hover:bg-accent"
            >
              <div className="flex items-center gap-3">
                <HardDrive className="text-muted-foreground" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{link.equipamento.tombamento}</p>
                    <Badge
                      className={`${statusInfo.color} text-white hover:${statusInfo.color} flex items-center gap-1`}
                    >
                      <Icon className="h-3 w-3" />
                      <span>{statusInfo.text}</span>
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {link.equipamento.tipoEquipamento.nome}
                  </p>
                  {link.equipamento.descricao && (
                    <p className="text-xs text-muted-foreground">{link.equipamento.descricao}</p>
                  )}
                </div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Desvincular
                      {' '}
                      {link.equipamento.tombamento}
                      ?
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <p className="text-sm text-muted-foreground">
                    O equipamento será desvinculado deste espaço. Esta ação não pode ser desfeita.
                  </p>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleUnlink(link)}>
                      Desvincular
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          );
        })}
      </div>

      {isAddDialogOpen && (
        <AddEquipamentoDialog
          open={isAddDialogOpen}
          onOpenChange={setAddDialogOpen}
          espacoId={espacoId}
          linkedEquipamentoIds={linkedEquipamentoIds}
        />
      )}
    </div>
  );
}
