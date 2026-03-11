'use client';

import type { Espaco } from '../types';
import {
  AlertTriangle,
  CalendarDays,
  HardDrive,
  Layers,
  Package,
  ShieldCheck,
  User,
  Wrench,
  XCircle,
} from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { RelatedItemLink } from '@/components/ui/related-item-link';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetEquipamentosGenericosEspaco } from '@/features/equipamentoGenerico/services/equipamentoGenericoService';
import { InfoItem } from '@/features/equipamentos/components/EquipamentoView';
import { EquipamentoStatus } from '@/features/equipamentos/types';
import { useGetEspacoGestores, useGetLinkedEquipamentos } from '../services/espacoService';
import { EspacoAgendaTab } from './EspacoAgendaTab';

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

export function EspacoMainDataView({ entity: espaco }: { entity: Espaco }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
      <InfoItem label="Nome do Espaço">{espaco.nome}</InfoItem>
      <InfoItem label="Departamento">{espaco.departamento.nome}</InfoItem>
      <InfoItem label="Localização">{espaco.localizacao.nome}</InfoItem>
      <InfoItem label="Tipo de Espaço">{espaco.tipoEspaco.nome}</InfoItem>
      <InfoItem label="Tipos de Atividade">
        <div className="flex flex-wrap gap-1">
          {espaco.tiposAtividade.map(t => (
            <Badge key={t.id} variant="secondary" className="text-xs">
              {t.nome}
            </Badge>
          ))}
        </div>
      </InfoItem>
      <div className="flex flex-col gap-4 md:col-span-2 md:flex-row">
        <InfoItem label="Precisa de Projeto?">{espaco.precisaProjeto ? 'Sim' : 'Não'}</InfoItem>
        <InfoItem label="Multiusuário?">{espaco.multiusuario ? 'Sim' : 'Não'}</InfoItem>
        <InfoItem label="Pode ser Reservado?">{espaco.reservavel ? 'Sim' : 'Não'}</InfoItem>
      </div>
      <InfoItem label="URL do CNPq" className="md:col-span-2">{espaco.urlCnpq || '-'}</InfoItem>
      <InfoItem label="Observação" className="md:col-span-2">{espaco.observacao || '-'}</InfoItem>
    </div>
  );
}

export function EspacoRelationsView({ entity: espaco }: { entity: Espaco }) {
  const { data: gestorLinks, isLoading: isLoadingGestores } = useGetEspacoGestores(espaco.id);
  const { data: equipamentoLinks, isLoading: isLoadingEquipamentos } = useGetLinkedEquipamentos(espaco.id);
  const { data: genericoAllocations, isLoading: isLoadingGenericos } = useGetEquipamentosGenericosEspaco(espaco.id);

  const activeGestores = gestorLinks?.filter(link => link.estaAtivo) ?? [];

  return (
    <Tabs defaultValue="agenda" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="agenda">
          <CalendarDays className="mr-2 h-4 w-4" />
          Agenda
        </TabsTrigger>
        <TabsTrigger value="gestores">
          <User className="mr-2 h-4 w-4" />
          Gestores (
          {isLoadingGestores ? '...' : activeGestores.length}
          )
        </TabsTrigger>
        <TabsTrigger value="equipamentos">
          <HardDrive className="mr-2 h-4 w-4" />
          Equipamentos (
          {isLoadingEquipamentos ? '...' : equipamentoLinks?.length ?? 0}
          )
        </TabsTrigger>
        <TabsTrigger value="equipamentos-genericos">
          <Layers className="mr-2 h-4 w-4" />
          Eq. Genéricos (
          {isLoadingGenericos ? '...' : genericoAllocations?.length ?? 0}
          )
        </TabsTrigger>
      </TabsList>

      <TabsContent value="agenda" className="mt-4">
        <EspacoAgendaTab espaco={espaco} />
      </TabsContent>

      <TabsContent value="gestores" className="mt-4">
        <div className="space-y-2 rounded-lg border p-2 min-h-25">
          {isLoadingGestores
            ? <Skeleton className="h-12 w-full" />
            : activeGestores.length > 0
              ? activeGestores.map(link => (
                  <div key={link.id} className="flex items-center gap-3 p-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{link.gestor.nome}</p>
                      <p className="text-xs text-muted-foreground">{link.gestor.email}</p>
                    </div>
                  </div>
                ))
              : <p className="text-center text-sm text-muted-foreground p-4">Nenhum gestor vinculado.</p>}
        </div>
      </TabsContent>

      <TabsContent value="equipamentos" className="mt-4">
        <div className="space-y-2 rounded-lg border p-4 min-h-25">
          {isLoadingEquipamentos
            ? <Skeleton className="h-20 w-full" />
            : (equipamentoLinks?.length ?? 0) > 0
                ? equipamentoLinks!.map((link) => {
                    const statusInfo = getStatusInfo(link.equipamento.status);
                    const Icon = statusInfo.icon;
                    return (
                      <RelatedItemLink
                        key={link.id}
                        href={`/dashboard/equipamentos?open=${link.equipamento.id}`}
                        icon={<HardDrive className="h-5 w-5 text-muted-foreground" />}
                        title={link.equipamento.tombamento}
                        description={`${link.equipamento.tipoEquipamento.nome}${link.equipamento.descricao ? ` · ${link.equipamento.descricao}` : ''}`}
                        asideContent={(
                          <Badge
                            className={`${statusInfo.color} text-white hover:${statusInfo.color} flex items-center gap-1 text-xs`}
                          >
                            <Icon className="h-3 w-3" />
                            <span>{statusInfo.text}</span>
                          </Badge>
                        )}
                      />
                    );
                  })
                : <p className="text-center text-sm text-muted-foreground p-4">Nenhum equipamento vinculado.</p>}
        </div>
      </TabsContent>

      <TabsContent value="equipamentos-genericos" className="mt-4">
        <div className="space-y-2 rounded-lg border p-4 min-h-25">
          {isLoadingGenericos
            ? <Skeleton className="h-20 w-full" />
            : (genericoAllocations?.length ?? 0) > 0
                ? genericoAllocations!.map(allocation => (
                    <div
                      key={allocation.id}
                      className="flex items-center justify-between p-2 rounded-md"
                    >
                      <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-muted-foreground" />
                        <p className="font-medium text-sm">{allocation.equipamentoGenerico.nome}</p>
                      </div>
                      <span className="text-sm text-muted-foreground tabular-nums">
                        {allocation.quantidade}
                        x
                      </span>
                    </div>
                  ))
                : <p className="text-center text-sm text-muted-foreground p-4">Nenhum equipamento genérico vinculado.</p>}
        </div>
      </TabsContent>
    </Tabs>
  );
}
