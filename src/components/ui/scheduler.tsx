'use client';

import type { DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type SchedulerProps = {
  events: EventInput[];
  onDateSelect: (arg: DateSelectArg) => void;
  onEventClick: (arg: EventClickArg) => void;
};

export function Scheduler({ events, onDateSelect, onEventClick }: SchedulerProps) {
  return (
    <div className="p-1">
      <div className="flex items-center mb-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-5 w-5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Clique e arraste no calendário para selecionar um período.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: '',
        }}
        events={events}
        height="auto"
        locale="pt-br"
        buttonText={{
          today: 'Hoje',
          month: 'Mês',
          week: 'Semana',
          day: 'Dia',
        }}
        allDaySlot={false}
        slotMinTime="07:00:00"
        slotMaxTime="22:00:00"
        selectable={true}
        selectMirror={true}
        select={onDateSelect}
        eventClick={onEventClick}
        selectOverlap={false}
        eventOverlap={false}
      />
    </div>
  );
}
