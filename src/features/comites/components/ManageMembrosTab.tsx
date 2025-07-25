'use client';

import type { ComiteUsuarioLink } from '../types';
import { Pencil, PlusCircle, Trash2, User } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { MasterDetailSheet } from '@/components/ui/master-detail-sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetComiteUsuarios, useUnlinkUsuarioFromComite } from '../services/comiteService';
import { LinkMembroForm } from './LinkMembroForm';

type Props = {
  comiteId: string;
};

const MembroDataView = () => null;

export function ManageMembrosTab({ comiteId }: Props) {
  const { data: membros, isLoading, isError } = useGetComiteUsuarios(comiteId);
  const unlinkMutation = useUnlinkUsuarioFromComite(comiteId);
  const existingMemberIds = useMemo(() => {
    return membros ? membros.map(link => link.usuario.id) : [];
  }, [membros]);
  const [sheetState, setSheetState] = useState<{ open: boolean; membro: ComiteUsuarioLink | null }>({
    open: false,
    membro: null,
  });
  const handleUnlink = (linkId: string) => {
    toast.promise(unlinkMutation.mutateAsync(linkId), {
      loading: 'Removendo membro...',
      success: 'Membro removido com sucesso!',
      error: 'Erro ao remover membro.',
    });
  };
  const handleOpenSheet = (membro: ComiteUsuarioLink | null) => setSheetState({ open: true, membro });
  const handleCloseSheet = () => setSheetState({ open: false, membro: null });
  if (isLoading) {
    return <Skeleton className="h-24 w-full" />;
  }
  if (isError) {
    return <p className="text-destructive text-center">Erro ao carregar membros.</p>;
  }
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Membros do Comitê</h3>
        <Button type="button" onClick={() => handleOpenSheet(null)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Membro
        </Button>
      </div>
      <div className="space-y-2 rounded-lg border p-2 min-h-[100px]">
        {membros && membros.length > 0
          ? (
              membros.map(link => (
                <div key={link.id} className="flex items-center justify-between p-2 rounded-md hover:bg-accent">
                  <div className="flex items-center gap-3">
                    <User className="text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {link.usuario.nome}
                        {' '}
                        {link.isTitular ? '(Titular)' : '(Suplente)'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Portaria:
                        {link.portaria}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenSheet(link)}><Pencil className="h-4 w-4 text-primary" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-red-500" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>Confirmar Remoção</AlertDialogTitle></AlertDialogHeader>
                        <AlertDialogDescription>Deseja realmente remover este membro do comitê?</AlertDialogDescription>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleUnlink(link.id)}>Remover</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))
            )
          : (
              <p className="text-center text-muted-foreground p-4">Nenhum membro vinculado.</p>
            )}
      </div>

      {sheetState.open && (
        <MasterDetailSheet
          key={sheetState.membro?.id ?? 'new-membro'}
          open={sheetState.open}
          onOpenChange={isOpen => !isOpen && handleCloseSheet()}
          entity={sheetState.membro}
          entityName="Membro"
          initialMode="edit"
          canEdit={true}
          FormComponent={props => (
            <LinkMembroForm
              {...props}
              comiteId={comiteId}
              existingMemberIds={existingMemberIds}
            />
          )}
          MainDataViewComponent={MembroDataView}
        />
      )}
    </div>
  );
}
