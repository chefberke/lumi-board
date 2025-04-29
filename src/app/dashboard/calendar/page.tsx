"use client";

import React, { useEffect, useState } from "react";
import KanbanCalendar from "@/components/calendar/Calendar";
import { getAllWorkspacesWithTasks } from "@/services/workspaceService";
import { KanbanWorkspace } from "@/stores/kanbanStore";

export default function CalendarPage() {
  const [workspaces, setWorkspaces] = useState<KanbanWorkspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWorkspaces() {
      try {
        setLoading(true);
        const data = await getAllWorkspacesWithTasks();
        setWorkspaces(data);
        setError(null);
      } catch (err) {
        console.error("An error occurred while loading workspaces:", err);
        setError(
          "An error occurred while loading the data. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchWorkspaces();
  }, []);

  return (
    <div className="h-full w-full">
      <h1 className="text-2xl font-bold mb-4">Calendar</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 p-4 rounded-md bg-red-50">{error}</div>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow-sm w-full h-full">
          <KanbanCalendar workspaces={workspaces} />
        </div>
      )}
    </div>
  );
}
