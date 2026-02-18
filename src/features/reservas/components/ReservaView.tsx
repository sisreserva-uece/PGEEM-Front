'use client';

import type { Reserva } from '../types';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { InfoItem } from '@/features/equipamentos/components/EquipamentoView';
import { useGetEquipamentoById } from '@/features/equipamentos/services/equipamentoService';
import { useGetEspacoById } from '@/features/espacos/services/espacoService';
import { useGetProjetoById } from '@/features/projetos/services/projetoService';
import { useGetUserById } from '@/features/usuarios/services/usuarioService';
import { parseUtcToLocal } from '@/lib/dateUtils';
import { ReservaStatusMap } from '../types';

export function ReservaMainDataView({ entity: reserva }: { entity: Reserva }) {
  const { data: espaco, isLoading: isLoadingEspaco } = useGetEspacoById(reserva.espacoId ?? null);
  const { data: usuario, isLoading: isLoadingUsuario } = useGetUserById(reserva.usuarioSolicitanteId);
  const { data: projeto, isLoading: isLoadingProjeto } = useGetProjetoById(reserva.projetoId);
  const { data: equipamento, isLoading: isLoadingEquipamento } = useGetEquipamentoById(reserva.equipamentoId ?? null);

  const formatDateTime = (dateString: string) =>
    parseUtcToLocal(dateString).toLocaleString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const statusInfo = ReservaStatusMap[reserva.status] ?? {
    label: 'Desconhecido',
    className: 'bg-gray-400',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
      {reserva.espacoId
        ? (
            <InfoItem label="Espaço Reservado" className="md:col-span-2">
              {isLoadingEspaco ? <Skeleton className="h-6 w-full" /> : espaco?.nome}
            </InfoItem>
          )
        : (
            <InfoItem label="Equipamento Reservado" className="md:col-span-2">
              {isLoadingEquipamento
                ? <Skeleton className="h-6 w-full" />
                : equipamento ? `${equipamento.tipoEquipamento.nome} - ${equipamento.tombamento}` : '-'}
            </InfoItem>
          )}
      <InfoItem label="Usuário Solicitante">
        {isLoadingUsuario ? <Skeleton className="h-6 w-48" /> : usuario?.nome}
      </InfoItem>
      <InfoItem label="Status da Reserva">
        <Badge className={`${statusInfo.className} text-white`}>{statusInfo.label}</Badge>
      </InfoItem>
      <InfoItem label="Início da Reserva">{formatDateTime(reserva.dataInicio)}</InfoItem>
      <InfoItem label="Fim da Reserva">{formatDateTime(reserva.dataFim)}</InfoItem>
      {reserva.projetoId && (
        <InfoItem label="Projeto Vinculado" className="md:col-span-2">
          {isLoadingProjeto ? <Skeleton className="h-6 w-full" /> : projeto?.nome}
        </InfoItem>
      )}
    </div>
  );
}

export function ReservaForm() {
  return null;
}
