import type { Metadata } from 'next';
import { ComitesPageClient } from '@/features/comites/components/ComitesPageClient';

export const metadata: Metadata = {
  title: 'Gerenciar Comitês',
  description: 'Visualize, crie e edite os comitês e seus membros.',
};

export default function ComitesPage() {
  return <ComitesPageClient />;
}
