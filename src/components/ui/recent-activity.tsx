"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import KanbanPlaceholder from "@/assets/kanban.png";
import Image from "next/image";

interface RecentWorkspace {
  id: string;
  name: string;
}

function RecentActivity() {
  const [recentWorkspaces, setRecentWorkspaces] = useState<RecentWorkspace[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedWorkspaces = localStorage.getItem("recentWorkspaces");

    if (storedWorkspaces) {
      try {
        const parsedWorkspaces = JSON.parse(storedWorkspaces);

        setRecentWorkspaces(parsedWorkspaces.slice(0, 5));
      } catch (error) {
        console.error("Error parsing recent activities:", error);
      }
    }

    setLoading(false);
  }, []);

  const handleWorkspaceClick = (id: string) => {
    router.push(`/dashboard/workspaces/${id}`);
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Recent Activities</h2>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (recentWorkspaces.length === 0) {
    return (
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Recent Activities</h2>
        <p className="text-sm text-muted-foreground">
          No workspaces have been visited yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-medium">Recent Activities</h2>
      <div className="space-y-2 flex gap-6 pt-1">
        {recentWorkspaces.map((workspace) => (
          <div
            key={workspace.id}
            onClick={() => handleWorkspaceClick(workspace.id)}
            className="p-3 rounded-md hover:bg-neutral-200 bg-accent transition-all cursor-pointer"
          >
            <div>
              <Image
                src={KanbanPlaceholder}
                alt="Kanban Board"
                width={180}
                height={180}
              />
            </div>
            <div className="flex justify-between items-center pt-2">
              <h3 className="font-medium">{workspace.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentActivity;
