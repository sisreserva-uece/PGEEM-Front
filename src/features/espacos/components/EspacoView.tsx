'use client';

import type { Espaco } from '../types';
import { AlertTriangle, HardDrive, ShieldCheck, User, Wrench, XCircle } from 'lucide-react';
import React, { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { RelatedItemLink } from '@/components/ui/related-item-link';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InfoItem } from '@/features/equipamentos/components/EquipamentoView';
import { EquipamentoStatus } from '@/features/equipamentos/types';
import { useGetEspacoGestores, useGetLinkedEquipamentos } from '../services/espacoService';

const getStatusInfo = (status: EquipamentoStatus) => {
  switch (status) {
    case EquipamentoStatus.ATIVO: return { text: 'Ativo', color: 'bg-green-500', icon: ShieldCheck };
    case EquipamentoStatus.INATIVO: return { text: 'Inativo', color: 'bg-red-500', icon: XCircle };
    case EquipamentoStatus.EM_MANUTENCAO: return { text: 'Manutenção', color: 'bg-yellow-500', icon: Wrench };
    default: return { text: 'Desconhecido', color: 'bg-gray-500', icon: AlertTriangle };
  }
};

export function EspacoMainDataView({ entity: espaco }: { entity: Espaco }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
      <InfoItem label="Nome do Espaço">{espaco.nome}</InfoItem>
      <InfoItem label="Departamento">{espaco.departamento.nome}</InfoItem>
      <InfoItem label="Localização">{espaco.localizacao.nome}</InfoItem>
      <InfoItem label="Tipo de Espaço">{espaco.tipoEspaco.nome}</InfoItem>
      <InfoItem label="Tipo de Atividade">{espaco.tipoAtividade.nome}</InfoItem>
      <InfoItem label="Precisa de Projeto?">{espaco.precisaProjeto ? 'Sim' : 'Não'}</InfoItem>
      <InfoItem label="URL do CNPq" className="md:col-span-2">{espaco.urlCnpq}</InfoItem>
      <InfoItem label="Observação" className="md:col-span-2">{espaco.observacao}</InfoItem>
    </div>
  );
}

export function EspacoRelationsView({ entity: espaco }: { entity: Espaco }) {
  const { data: gestorLinks, isLoading: isLoadingGestores } = useGetEspacoGestores(espaco.id);
  const { data: equipamentoLinks, isLoading: isLoadingEquipamentos } = useGetLinkedEquipamentos(espaco.id);
  const { specificItems, genericItemsGrouped } = useMemo(() => {
    const specific: any[] = [];
    const genericMap = new Map<string, { count: number; items: any[] }>();
    equipamentoLinks?.forEach((link) => {
      if (link.equipamento.tipoEquipamento.isDetalhamentoObrigatorio) {
        specific.push(link);
      } else {
        const tipoId = link.equipamento.tipoEquipamento.id;
        if (!genericMap.has(tipoId)) {
          genericMap.set(tipoId, { count: 0, items: [] });
        }
        genericMap.get(tipoId)!.items.push(link);
        genericMap.get(tipoId)!.count++;
      }
    });
    return { specificItems: specific, genericItemsGrouped: Array.from(genericMap.values()) };
  }, [equipamentoLinks]);
  const activeGestores = gestorLinks?.filter(link => link.estaAtivo) ?? [];
  return (
    <Tabs defaultValue="gestores" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="gestores">
          Gestores (
          {isLoadingGestores ? '...' : activeGestores.length}
          )
        </TabsTrigger>
        <TabsTrigger value="equipamentos">
          Equipamentos (
          {isLoadingEquipamentos ? '...' : equipamentoLinks?.length ?? 0}
          )
        </TabsTrigger>
      </TabsList>
      <TabsContent value="gestores" className="mt-4">
        <div className="space-y-2 rounded-lg border p-2 min-h-[100px]">
          {isLoadingGestores
            ? <Skeleton className="h-12 w-full" />
            : activeGestores.length > 0
              ? (
                  activeGestores.map(link => (
                    <div key={link.id} className="flex items-center gap-3 p-2">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{link.gestor.nome}</p>
                        <p className="text-xs text-muted-foreground">{link.gestor.email}</p>
                      </div>
                    </div>
                  ))
                )
              : <p className="text-center text-sm text-muted-foreground p-4">Nenhum gestor vinculado.</p>}
        </div>
      </TabsContent>
      <TabsContent value="equipamentos" className="mt-4">
        <div className="space-y-4 rounded-lg border p-4 min-h-[100px]">
          {isLoadingEquipamentos
            ? <Skeleton className="h-20 w-full" />
            : (equipamentoLinks?.length ?? 0) > 0
                ? (
                    <>
                      {specificItems.map((link) => {
                        const statusInfo = getStatusInfo(link.equipamento.status);
                        const Icon = statusInfo.icon;
                        return (
                          <RelatedItemLink
                            key={link.id}
                            href={`/dashboard/equipamentos?open=${link.equipamento.id}`}
                            icon={<HardDrive className="h-5 w-5 text-muted-foreground" />}
                            title={link.equipamento.tombamento}
                            description={link.equipamento.descricao}
                            asideContent={(
                              <Badge className={`${statusInfo.color} text-white hover:${statusInfo.color} flex items-center gap-1 text-xs`}>
                                <Icon className="h-3 w-3" />
                                <span>{statusInfo.text}</span>
                              </Badge>
                            )}
                          />
                        );
                      })}
                      {genericItemsGrouped.map((group, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <HardDrive className="h-5 w-5 text-muted-foreground opacity-60" />
                          <div>
                            <p className="font-medium text-sm">
                              {group.count}
                              x
                              {' '}
                              {group.items[0].equipamento.tipoEquipamento.nome}
                            </p>
                            <p className="text-xs text-muted-foreground">Item genérico</p>
                          </div>
                        </div>
                      ))}
                    </>
                  )
                : <p className="text-center text-sm text-muted-foreground p-4">Nenhum equipamento vinculado.</p>}
        </div>
      </TabsContent>
    </Tabs>
  );
}
