'use client';

import type { Complexo } from '../types';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetLinkedEspacos } from '@/features/complexos/services/complexoService';
import { InfoItem } from '@/features/equipamentos/components/EquipamentoView';

export function ComplexoMainDataView({ entity: complexo }: { entity: Complexo }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
      <InfoItem label="Nome" className="md:col-span-2">{complexo.nome}</InfoItem>
      <InfoItem label="Site" className="md:col-span-2">
        {complexo.site
          ? (
              <Link href={complexo.site} target="_blank" rel="noopener noreferrer" className="text-primary underline-offset-4 hover:underline">
                {complexo.site}
              </Link>
            )
          : null}
      </InfoItem>
      <InfoItem label="Descrição" className="md:col-span-2">{complexo.descricao}</InfoItem>
    </div>
  );
}

export function ComplexoRelationsView({ entity: complexo }: { entity: Complexo }) {
  const { data: linkedEspacos, isLoading } = useGetLinkedEspacos(complexo.id);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-2">Espaços Vinculados</h3>
      <div className="rounded-md border min-h-[200px]">
        {isLoading
          ? (
              <div className="p-3 space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            )
          : linkedEspacos && linkedEspacos.length > 0
            ? (
                <ul className="divide-y">
                  {linkedEspacos.map(espaco => (
                    <li key={espaco.id} className="p-3">
                      <p className="font-medium">{espaco.nome}</p>
                      <p className="text-sm text-muted-foreground">{espaco.departamento.nome}</p>
                    </li>
                  ))}
                </ul>
              )
            : (
                <p className="p-4 text-center text-muted-foreground">Nenhum espaço vinculado.</p>
              )}
      </div>
    </div>
  );
}
