'use client';

import type { Usuario } from '../types';
import { Badge } from '@/components/ui/badge';
import { InfoItem } from '@/features/equipamentos/components/EquipamentoView';

export function UsuarioMainDataView({ entity: usuario }: { entity: Usuario }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
      <InfoItem label="Nome Completo">{usuario.nome}</InfoItem>
      <InfoItem label="Email">{usuario.email}</InfoItem>
      <InfoItem label="Matrícula">{usuario.matricula}</InfoItem>
      <InfoItem label="Documento Fiscal">{usuario.documentoFiscal}</InfoItem>
      <InfoItem label="Telefone">{usuario.telefone}</InfoItem>
      <InfoItem label="Instituição">{usuario.instituicao.nome}</InfoItem>
    </div>
  );
}

export function UsuarioRelationsView({ entity: usuario }: { entity: Usuario }) {
  return (
    <div>
      <h3 className="text-md font-semibold tracking-tight text-foreground mb-4">Cargos</h3>
      <div className="flex flex-wrap gap-2">
        {usuario.cargos.length > 0
          ? (
              usuario.cargos.map(cargo => <Badge key={cargo.id} variant="secondary">{cargo.nome}</Badge>)
            )
          : (
              <p className="text-sm text-muted-foreground italic">Nenhum cargo associado.</p>
            )}
      </div>
    </div>
  );
}
