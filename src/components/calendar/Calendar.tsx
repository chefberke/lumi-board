"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { tr } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { KanbanWorkspace } from "@/stores/kanbanStore";

import { dateFnsLocalizer } from "react-big-calendar";

const locales = {
  tr: tr,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface Task {
  id: string;
  title: string;
  description: string;
  createdAt?: string;
  start?: Date;
  end?: Date;
}

interface CalendarProps {
  workspaces?: Array<{
    id: string;
    title: string;
    columns: Array<{
      id: string;
      title: string;
      cards: Task[];
    }>;
  }>;
}

const KanbanCalendar: React.FC<CalendarProps> = ({ workspaces = [] }) => {
  const [events, setEvents] = useState<Task[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const allTasks: Task[] = [];

    if (!workspaces || workspaces.length === 0) {
      setEvents([]);
      return;
    }

    workspaces.forEach((workspace) => {
      if (workspace && workspace.columns) {
        workspace.columns.forEach((column) => {
          if (column && column.cards) {
            column.cards.forEach((card) => {
              if (card && card.createdAt) {
                const createdDate = new Date(card.createdAt);

                allTasks.push({
                  ...card,
                  start: createdDate,
                  end: createdDate,
                });
              }
            });
          }
        });
      }
    });

    setEvents(allTasks);
  }, [workspaces]);

  const handleSelectEvent = (event: Task) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedEvent(null);
  };

  const eventStyleGetter = (event: Task) => {
    return {
      style: {
        backgroundColor: "#4B4EE7",
        borderRadius: "4px",
        color: "white",
        border: "none",
        display: "block",
      },
    };
  };

  return (
    <div className="h-[calc(100vh-200px)] w-full flex-1">
      <Calendar
        localizer={localizer as any}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%", width: "100%" }}
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        defaultView={Views.MONTH}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
        toolbar={false}
        className="rbc-calendar-custom w-full"
      />

      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            <DialogDescription>{selectedEvent?.description}</DialogDescription>
          </DialogHeader>
          <div className="text-sm text-gray-500">
            Created At:{" "}
            {selectedEvent?.createdAt
              ? new Date(selectedEvent.createdAt).toLocaleDateString("tr-TR")
              : ""}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KanbanCalendar;
