'use client';

import type { DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core';
import type { Espaco } from '../types';
import type { Reserva } from '@/features/reservas/types';
import { Loader2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { MasterDetailSheet } from '@/components/ui/master-detail-sheet';
import { Scheduler } from '@/components/ui/scheduler';
import { useAuthStore } from '@/features/auth/store/authStore';
import { ReservaForm, ReservaMainDataView } from '@/features/reservas/components/ReservaView';
import { SolicitarReservaDialog } from '@/features/reservas/components/SolicitarReservaDialog';
import { useGetAgendaReservasByEspaco } from '@/features/reservas/services/reservaService';
import { ReservaStatus } from '@/features/reservas/types';
import { parseUtcToLocal } from '@/lib/dateUtils';

const getEventStyle = (reserva: Reserva, currentUserId?: string) => {
  const isOwner = reserva.usuarioSolicitanteId === currentUserId;
  if (reserva.status === ReservaStatus.APROVADO) {
    return {
      backgroundColor: isOwner ? '#16a34a' : '#2563eb',
      borderColor: isOwner ? '#16a34a' : '#2563eb',
      title: `Reservado por ${isOwner ? 'Você' : 'Outro Usuário'}`,
    };
  }
  if (reserva.status === ReservaStatus.PENDENTE) {
    return {
      backgroundColor: isOwner ? '#ca8a04' : '#a1a1aa',
      borderColor: isOwner ? '#ca8a04' : '#a1a1aa',
      title: `Pendente (${isOwner ? 'Sua solicitação' : 'Outro Usuário'})`,
    };
  }
  return {};
};

export function EspacoAgendaTab({ espaco }: { espaco: Espaco }) {
  const { user } = useAuthStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogDates, setDialogDates] = useState<{ start: Date; end: Date } | undefined>(undefined);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState<Reserva | null>(null);

  const { data: reservas, isLoading: isLoadingReservas } = useGetAgendaReservasByEspaco(espaco.id);

  const calendarEvents = useMemo((): EventInput[] => {
    if (!reservas) {
      return [];
    }
    return reservas.map((reserva) => {
      const { backgroundColor, borderColor, title } = getEventStyle(reserva, user?.id);
      return {
        id: reserva.id,
        start: parseUtcToLocal(reserva.dataInicio),
        end: parseUtcToLocal(reserva.dataFim),
        title,
        backgroundColor,
        borderColor,
        extendedProps: { reserva },
      };
    });
  }, [reservas, user?.id]);

  const handleDateSelect = useCallback((selectInfo: DateSelectArg) => {
    setDialogDates({ start: selectInfo.start, end: selectInfo.end });
    setDialogOpen(true);
    selectInfo.view.calendar.unselect();
  }, []);

  const handleEventClick = useCallback((clickInfo: EventClickArg) => {
    const reserva = clickInfo.event.extendedProps.reserva as Reserva;
    if (reserva.status === ReservaStatus.APROVADO) {
      setSelectedReserva(reserva);
      setSheetOpen(true);
    }
  }, []);

  if (isLoadingReservas) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        <Scheduler
          events={calendarEvents}
          onDateSelect={handleDateSelect}
          onEventClick={handleEventClick}
        />
      </div>

      <SolicitarReservaDialog
        espaco={espaco}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialDates={dialogDates}
      />

      {sheetOpen && selectedReserva && (
        <MasterDetailSheet
          key={selectedReserva.id}
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          entity={selectedReserva}
          entityName="Detalhes da Reserva"
          initialMode="view"
          canEdit={false}
          FormComponent={ReservaForm}
          MainDataViewComponent={ReservaMainDataView}
        />
      )}
    </>
  );
}
