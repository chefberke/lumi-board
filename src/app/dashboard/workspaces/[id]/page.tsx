"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import KanbanBoard from "@/components/kanban/Columns";
import { useKanbanStore } from "@/stores/kanbanStore";
import { getUser } from "@/lib/authClient";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

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
      fetchData?.(workspaceId);
    }
  }, [workspaceId, fetchData]);

  useEffect(() => {
    if (workspaceName) {
      saveRecentWorkspace(workspaceId, workspaceName);
    }
  }, [workspaceId, workspaceName]);

  useEffect(() => {
    if (data?.workspace) {
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
      <div className="flex h-full gap-4">
        <Skeleton className="w-[300px] h-full" />
        <Skeleton className="w-[300px] h-full" />
        <Skeleton className="w-[300px] h-full" />
      </div>
    );
  }

  if (!data?.workspace || !isAuthorized) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 dark:text-white">
          Workspace not found
        </h1>
        <p className="dark:text-neutral-400">
          The requested workspace could not be found.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full">
      <KanbanBoard columns={data.workspace.columns} />
    </div>
  );
}

export default WorkspacePage;
