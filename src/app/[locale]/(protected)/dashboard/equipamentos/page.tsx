import type { Metadata } from 'next';
import { EquipamentosPageClient } from '@/features/equipamentos/components/EquipamentosPageClient';

export const metadata: Metadata = {
  title: 'Gerenciar Equipamentos',
  description: 'Visualize, crie e edite os equipamentos e seus tipos.',
};

export default function EquipamentosPage() {
  return <EquipamentosPageClient />;
}
