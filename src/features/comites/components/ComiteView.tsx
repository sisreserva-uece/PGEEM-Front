'use client';

import type { Comite } from '../types';
import { User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InfoItem } from '@/features/equipamentos/components/EquipamentoView';
import { useGetComiteUsuarios } from '../services/comiteService';
import { ComiteTipoMap } from '../types';

export function ComiteMainDataView({ entity: comite }: { entity: Comite }) {
  return (
    <div className="grid grid-cols-1 gap-y-6">
      <InfoItem label="Descrição">{comite.descricao}</InfoItem>
      <InfoItem label="Tipo"><Badge variant="outline">{ComiteTipoMap[comite.tipo]}</Badge></InfoItem>
    </div>
  );
}

export function ComiteRelationsView({ entity: comite }: { entity: Comite }) {
  const { data: membros, isLoading } = useGetComiteUsuarios(comite.id);

  return (
    <Tabs defaultValue="membros" className="w-full">
      <TabsList className="grid w-full grid-cols-1">
        <TabsTrigger value="membros">
          Membros (
          {isLoading ? '...' : membros?.length ?? 0}
          )
        </TabsTrigger>
      </TabsList>
      <TabsContent value="membros" className="mt-4">
        <div className="space-y-2 rounded-lg border p-2 min-h-[100px]">
          {isLoading
            ? <Skeleton className="h-12 w-full" />
            : (
                membros && membros.length > 0
                  ? (
                      membros.map(link => (
                        <div key={link.id} className="flex items-center gap-3 p-2">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">
                              {link.usuario.nome}
                              {' '}
                              {link.isTitular ? '(Titular)' : ''}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Portaria:
                              {link.portaria}
                            </p>
                          </div>
                        </div>
                      ))
                    )
                  : <p className="text-center text-sm text-muted-foreground p-4">Nenhum membro vinculado.</p>
              )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
