'use client';

import type { Projeto } from '../types';
import { Skeleton } from '@/components/ui/skeleton';
import { InfoItem } from '@/features/equipamentos/components/EquipamentoView';
import { useGetInstituicaoById, useGetUserById } from '@/features/usuarios/services/usuarioService';

export function ProjetoMainDataView({ entity: projeto }: { entity: Projeto }) {
  const { data: usuarioResponsavel, isLoading: isLoadingUsuario } = useGetUserById(projeto.usuarioResponsavelId);
  const { data: instituicao, isLoading: isLoadingInstituicao } = useGetInstituicaoById(projeto.instituicaoId);

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
      <InfoItem label="Nome do Projeto" className="md:col-span-2">{projeto.nome}</InfoItem>
      <InfoItem label="Responsável">
        {isLoadingUsuario ? <Skeleton className="h-6 w-48" /> : (usuarioResponsavel?.nome ?? 'Não encontrado')}
      </InfoItem>
      <InfoItem label="Instituição">
        {isLoadingInstituicao ? <Skeleton className="h-6 w-48" /> : (instituicao?.nome ?? 'Não encontrada')}
      </InfoItem>
      <InfoItem label="Data de Início">{formatDate(projeto.dataInicio)}</InfoItem>
      <InfoItem label="Data de Fim">{formatDate(projeto.dataFim)}</InfoItem>
      <InfoItem label="Descrição" className="md:col-span-2">
        <p className="whitespace-pre-wrap">{projeto.descricao}</p>
      </InfoItem>
    </div>
  );
}
