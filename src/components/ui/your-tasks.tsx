"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useKanbanStore } from "@/stores/kanbanStore";
import { getWorkspaces } from "@/stores/getWorkspace";

interface Task {
  id: string;
  title: string;
  description: string;
  workspaceId: string;
  workspaceName: string;
  columnName: string;
}

function YourTasks() {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: workspaces } = getWorkspaces();

  useEffect(() => {
    const getAllTasks = async () => {
      setLoading(true);
      try {
        // Get all workspaces directly from the store
        let workspaceIds: string[] = [];

        if (workspaces && workspaces.length > 0) {
          workspaceIds = workspaces.map((workspace: any) => workspace.id);
        } else {
          // Fallback to localStorage if no workspaces in store
          const storedWorkspaces = localStorage.getItem("recentWorkspaces");
          if (storedWorkspaces) {
            try {
              const parsedWorkspaces = JSON.parse(storedWorkspaces);
              workspaceIds = parsedWorkspaces.map(
                (workspace: any) => workspace.id
              );
            } catch (err) {
              console.error("Error parsing workspaces:", err);
            }
          }
        }

        // Collect tasks from each workspace
        const tasks: Task[] = [];

        for (const workspaceId of workspaceIds) {
          const workspaceData = await fetchWorkspaceData(workspaceId);

          if (workspaceData && workspaceData.workspace) {
            const { title: workspaceName, columns } = workspaceData.workspace;

            // Collect tasks from each column
            columns.forEach((column: any) => {
              const columnName = column.title;

              column.cards.forEach((card: any) => {
                tasks.push({
                  id: card.id,
                  title: card.title,
                  description: card.description,
                  workspaceId,
                  workspaceName,
                  columnName,
                });
              });
            });
          }
        }

        setAllTasks(tasks);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError(
          "An error occurred while loading tasks. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    getAllTasks();
  }, [workspaces]);

  // Helper function to fetch workspace data from Kanban Store
  const fetchWorkspaceData = async (workspaceId: string) => {
    const { fetchData } = useKanbanStore.getState();
    try {
      await fetchData(workspaceId);
      return useKanbanStore.getState().data;
    } catch (err) {
      console.error(
        `Error fetching workspace data for ID ${workspaceId}:`,
        err
      );
      return null;
    }
  };

  const handleTaskClick = (workspaceId: string) => {
    router.push(`/dashboard/workspaces/${workspaceId}`);
  };

  if (loading) {
    return (
      <div className="space-y-2 pb-8">
        <h2 className="text-lg font-medium">Your Tasks</h2>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2 pb-8">
        <h2 className="text-lg font-medium">Your Tasks</h2>
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (allTasks.length === 0) {
    return (
      <div className="space-y-2 pb-8">
        <h2 className="text-lg font-medium">Your Tasks</h2>
        <p className="text-sm text-muted-foreground">
          No tasks have been created yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 pb-8">
      <h2 className="text-lg font-medium">Your Tasks</h2>
      <div className="space-y-2">
        {allTasks.map((task) => (
          <div
            key={task.id}
            onClick={() => handleTaskClick(task.workspaceId)}
            className="p-4 rounded-lg border border-gray-100 hover:bg-accent hover:border-primary/20 transition-all cursor-pointer"
          >
            <div className="flex flex-col">
              <h3 className="font-medium text-neutral-700">{task.title}</h3>
              <div className="flex justify-between items-center mt-2">
                <span
                  className={`text-xs text-primary px-2 py-0.5 rounded-full ${
                    task.columnName == "Done" ? "bg-green-300" : ""
                  }
                  ${task.columnName == "In Progress" ? "bg-yellow-300" : ""}

                  ${task.columnName == "Todo" ? "bg-blue-400" : ""}
                  `}
                >
                  {task.columnName}
                </span>
                <span className="text-xs text-muted-foreground">
                  {task.workspaceName}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default YourTasks;
