import type { Metadata } from 'next';
import { UsuariosPageClient } from '@/features/usuarios/components/UsuariosPageClient';

export const metadata: Metadata = {
  title: 'Gerenciar Usuários',
  description: 'Visualize e edite os usuários do sistema.',
};

export default function UsuariosPage() {
  return <UsuariosPageClient />;
}
