import type { Metadata } from 'next';
import { RelatoriosPageClient } from '@/features/relatorios/components/RelatoriosPageClient';

export const metadata: Metadata = {
  title: 'Gerar Relatórios',
  description: 'Faça relatórios de Espaços e Equipamentos Multiusuários.',
};

export default function RelatoriosPage() {
  return <RelatoriosPageClient />;
}