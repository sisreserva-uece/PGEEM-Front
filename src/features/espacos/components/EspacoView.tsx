'use client';

import type { Espaco } from '../types';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

type InfoItemProps = {
  label: string;
  children: React.ReactNode;
};

function InfoItem({ label, children }: InfoItemProps) {
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-base">{children || <span className="text-muted-foreground italic">Não informado</span>}</p>
    </div>
  );
}

type EspacoViewProps = {
  espaco: Espaco;
};

export function EspacoView({ espaco }: EspacoViewProps) {
  const handleNavigateToGestores = () => { /* ... */ };
  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-lg font-semibold tracking-tight text-foreground mb-4">Dados Principais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
          <InfoItem label="Nome do Espaço">{espaco.nome}</InfoItem>
          <InfoItem label="Departamento">{espaco.departamento.nome}</InfoItem>
          <InfoItem label="Localização">{espaco.localizacao.nome}</InfoItem>
          <InfoItem label="Tipo de Espaço">{espaco.tipoEspaco.nome}</InfoItem>
          <InfoItem label="Tipo de Atividade">{espaco.tipoAtividade.nome}</InfoItem>
          <InfoItem label="Precisa de Projeto?">{espaco.precisaProjeto ? 'Sim' : 'Não'}</InfoItem>
          <div className="md:col-span-2">
            <InfoItem label="URL do CNPq">{espaco.urlCnpq}</InfoItem>
          </div>
          <div className="md:col-span-2">
            <InfoItem label="Observação">{espaco.observacao}</InfoItem>
          </div>
        </div>
      </section>
      <Separator />
      <section>
        <h3 className="text-lg font-semibold tracking-tight text-foreground mb-2">Relações</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Gerencie as entidades relacionadas a este espaço.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleNavigateToGestores}>
            Gerenciar Gestores
          </Button>
        </div>
      </section>
    </div>
  );
}
