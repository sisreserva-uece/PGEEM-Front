import type { Metadata } from 'next';
import { EditarPageClient } from '@/features/editarperfil/components/EditarPageClient';

export const metadata: Metadata = {
  title: 'Editar Dados Pessoais',
  description: 'Edite e atualize seus dados pessoais'
};

export default function EquipamentosPage() {
  return <EditarPageClient />;
}