"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import KanbanBoard from "@/components/kanban/Columns";
import { useKanbanStore } from "@/stores/kanbanStore";
import { getUser } from "@/lib/authClient";
import { useRouter } from "next/navigation";

function WorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.id as string;
  const { data, loading, error, fetchData } = useKanbanStore();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  const saveRecentWorkspace = (workspaceId: string, workspaceName: string) => {
    if (!workspaceId && !workspaceName) return;

    const key = "recentWorkspaces";
    const existingRaw = localStorage.getItem(key);
    let existing: { id: string; name: string }[] = [];

    if (existingRaw) {
      try {
        existing = JSON.parse(existingRaw) || [];
        if (!Array.isArray(existing)) {
          existing = [];
        }
      } catch (error) {
        existing = [];
      }
    }
    if (!workspaceName) {
      return;
    }

    const updated = existing.filter(
      (workspace) => workspace.id !== workspaceId
    );

    updated.unshift({
      id: workspaceId,
      name: workspaceName,
    });

    const limited = updated.slice(0, 5);
    localStorage.setItem(key, JSON.stringify(limited));
  };

  const workspaceName = data?.workspace?.title;

  useEffect(() => {
    if (workspaceId) {
      fetchData(workspaceId);
      saveRecentWorkspace(workspaceId, workspaceName);
    }
  }, [workspaceId, workspaceName, fetchData]);

  console.log(data);

  useEffect(() => {
    if (data && data.workspace) {
      const user = getUser();
      if (user && user.id === data.workspace.ownerId) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
        router.push("/dashboard");
      }
    }
  }, [data, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!data || !data.workspace || !isAuthorized) {
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
