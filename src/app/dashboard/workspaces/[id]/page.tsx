"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import KanbanBoard from "@/components/kanban/Columns";
import { useKanbanStore } from "@/stores/kanbanStore";

function WorkspacePage() {
  const params = useParams();
  const workspaceId = params.id as string;
  const { data, loading, error, fetchData } = useKanbanStore();

  useEffect(() => {
    if (workspaceId) {
      fetchData(workspaceId);
    }
  }, [workspaceId, fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!data || !data.workspace) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Workspace not found</h1>
        <p>The requested workspace could not be found.</p>
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* <h1 className="text-2xl font-bold mb-4">{data.workspace.title}</h1> */}
      <KanbanBoard columns={data.workspace.columns} />
    </div>
  );
}

export default WorkspacePage;
