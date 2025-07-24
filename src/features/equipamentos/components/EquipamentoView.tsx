'use client';

import type { Equipamento } from '../types';
import Link from 'next/link';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetEspacoForEquipamento } from '@/features/equipamentos/services/equipamentoService';
import { EquipamentoStatus } from '../types';

function InfoItem({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
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
type EquipamentoViewProps = {
  entity: Equipamento;
};
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

export function EquipamentoView({ entity }: EquipamentoViewProps) {
  const statusInfo = statusMap[entity.status] || { label: 'Desconhecido', className: 'bg-gray-400' };
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
        <InfoItem label="Tombamento">{entity.tombamento}</InfoItem>
        <InfoItem label="Tipo">{entity.tipoEquipamento.nome}</InfoItem>
        <InfoItem label="Status" className="md:col-span-2">
          <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
        </InfoItem>
        <InfoItem label="Descrição" className="md:col-span-2">
          {entity.descricao}
        </InfoItem>
        <InfoItem label="Alocado no Espaço" className="md:col-span-2">
          <LinkedSpaceInfo equipamentoId={entity.id} />
        </InfoItem>
      </div>
    </div>
  );
}
