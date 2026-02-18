'use client';

import type { Espaco } from '../types';
import { useMemo } from 'react';
import { espacoToResource } from '@/features/espacos/utils/espacoToResource';
import ReservableAgenda from '@/features/reservas/components/ReservableAgenda';

export function EspacoAgendaTab({ espaco }: { espaco: Espaco }) {
  const resource = useMemo(() => espacoToResource(espaco), [espaco]);

  return <ReservableAgenda resource={resource} />;
}
