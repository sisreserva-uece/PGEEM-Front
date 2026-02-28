'use client';

import type { Equipamento } from '../types';
import { CalendarDays, MapPin } from 'lucide-react';
import React, { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { BooleanBadge } from '@/components/ui/boolean-badge';
import { RelatedItemLink } from '@/components/ui/related-item-link';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetEspacoForEquipamento } from '@/features/equipamentos/services/equipamentoService';
import { equipamentoToResource } from '@/features/equipamentos/utils/equipamentoToResource';
import ReservableAgenda from '@/features/reservas/components/ReservableAgenda';
import { EquipamentoStatus } from '../types';

export function InfoItem({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="text-base">{children || <span className="text-muted-foreground italic">Não informado</span>}</div>
    </div>
  );
}

const statusMap: Record<EquipamentoStatus, { label: string; className: string }> = {
  [EquipamentoStatus.ATIVO]: { label: 'Ativo', className: 'bg-green-500 hover:bg-green-600' },
  [EquipamentoStatus.INATIVO]: { label: 'Inativo', className: 'bg-red-500 hover:bg-red-600' },
  [EquipamentoStatus.EM_MANUTENCAO]: { label: 'Em Manutenção', className: 'bg-yellow-500 hover:bg-yellow-600' },
};

export function EquipamentoMainDataView({ entity: equipamento }: { entity: Equipamento }) {
  const statusInfo = statusMap[equipamento.status] || { label: 'Desconhecido', className: 'bg-gray-400' };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
      <InfoItem label="Tombamento">{equipamento.tombamento}</InfoItem>
      <InfoItem label="Tipo">{equipamento.tipoEquipamento.nome}</InfoItem>
      <InfoItem label="Status" className="md:col-span-2">
        <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
      </InfoItem>
      <InfoItem label="Pode ser Reservado" className="md:col-span-2">
        <BooleanBadge value={equipamento.reservavel} />
      </InfoItem>
      <InfoItem label="Descrição" className="md:col-span-2">{equipamento.descricao}</InfoItem>
    </div>
  );
}

export function EquipamentoRelationsView({ entity: equipamento }: { entity: Equipamento }) {
  const { data: espaco, isLoading } = useGetEspacoForEquipamento(equipamento.id);
  const resource = useMemo(() => equipamentoToResource(equipamento), [equipamento]);

  return (
    <Tabs defaultValue="agenda" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="agenda">
          <CalendarDays className="mr-2 h-4 w-4" />
          Agenda
        </TabsTrigger>
        <TabsTrigger value="alocacao">
          <MapPin className="mr-2 h-4 w-4" />
          Alocação (
          {isLoading ? '...' : (espaco ? '1' : '0')}
          )
        </TabsTrigger>
      </TabsList>

      <TabsContent value="agenda" className="mt-4">
        <ReservableAgenda resource={resource} />
      </TabsContent>

      <TabsContent value="alocacao" className="mt-4">
        <div className="space-y-2 rounded-lg border p-2 min-h-[100px]">
          {isLoading
            ? (
                <Skeleton className="h-12 w-full" />
              )
            : espaco
              ? (
                  <RelatedItemLink
                    href={`/dashboard/espacos?open=${espaco.id}`}
                    icon={<MapPin className="h-5 w-5 text-muted-foreground" />}
                    title={espaco.nome}
                    description={`Departamento: ${espaco.departamento.nome}`}
                  />
                )
              : (
                  <p className="text-center text-sm text-muted-foreground p-4">Nenhum espaço vinculado.</p>
                )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
