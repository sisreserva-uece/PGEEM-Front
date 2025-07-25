import type { Metadata } from 'next';
import { ReservasPageClient } from '@/features/reservas/components/ReservasPageClient';

export const metadata: Metadata = {
  title: 'Minhas Reservas',
  description: 'Acompanhe o status das suas solicitações de reserva.',
};

export default function ReservasPage() {
  return <ReservasPageClient />;
}
