'use client';

import type { Equipamento } from '../types';
import { MapPin } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { RelatedItemLink } from '@/components/ui/related-item-link';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetEspacoForEquipamento } from '@/features/equipamentos/services/equipamentoService';
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
      <InfoItem label="Descrição" className="md:col-span-2">{equipamento.descricao}</InfoItem>
    </div>
  );
}

function LinkedSpaceInfo({ equipamentoId }: { equipamentoId: string }) {
  const { data: espaco, isLoading, isError } = useGetEspacoForEquipamento(equipamentoId);
  if (isLoading) {
    return <Skeleton className="h-5 w-48" />;
  }
  if (isError) {
    return <p className="text-sm text-destructive">Erro ao carregar alocação.</p>;
  }
  return espaco
    ? (
        <Link
          href={`/dashboard/espacos?open=${espaco.id}`}
          className="text-primary underline-offset-4 hover:underline"
        >
          {espaco.nome}
        </Link>
      )
    : (
        <span className="text-muted-foreground italic">Nenhum (Disponível)</span>
      );
}

export function EquipamentoRelationsView({ entity: equipamento }: { entity: Equipamento }) {
  const { data: espaco, isLoading } = useGetEspacoForEquipamento(equipamento.id);
  return (
    <Tabs defaultValue="alocacao" className="w-full">
      <TabsList className="grid w-full grid-cols-1">
        {' '}
        <TabsTrigger value="alocacao">
          Alocação (
          {isLoading ? '...' : (espaco ? '1' : '0')}
          )
        </TabsTrigger>
      </TabsList>
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
