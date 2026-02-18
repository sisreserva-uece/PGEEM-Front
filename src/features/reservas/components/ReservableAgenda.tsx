'use client';

import type { ReservableResource } from '../types';
import { useState } from 'react';
import { Scheduler } from '@/components/ui/scheduler';
import { SolicitarReservaDialog } from '@/features/reservas/components/SolicitarReservaDialog';
import { useGetAgendaReservas } from '@/features/reservas/services/reservaService';
import { ReservaStatusMap } from '../types';

type Props = {
  resource: ReservableResource;
};

export default function ReservableAgenda({ resource }: Props) {
  const { data: reservas = [] } = useGetAgendaReservas(resource);
  const [openDialog, setOpenDialog] = useState(false);

  const events = reservas.map(reserva => ({
    id: reserva.id,
    title: ReservaStatusMap[reserva.status].label,
    start: new Date(reserva.dataInicio),
    end: new Date(reserva.dataFim),
    className: ReservaStatusMap[reserva.status].className,
  }));

  return (
    <>
      <Scheduler
        events={events}
        onEventClick={() => setOpenDialog(true)}
      />

      <SolicitarReservaDialog
        resource={resource}
        open={openDialog}
        onOpenChange={setOpenDialog}
      />
    </>
  );
}
