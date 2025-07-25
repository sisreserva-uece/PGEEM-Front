import type { Metadata } from 'next';
import { ProjetosPageClient } from '@/features/projetos/components/ProjetosPageClient';

export const metadata: Metadata = {
  title: 'Gerenciar Projetos',
  description: 'Visualize e crie os projetos de pesquisa e extensão.',
};

export default function ProjetosPage() {
  return <ProjetosPageClient />;
}
