"use client";

import React, { useEffect } from "react";

import {
  SidebarContent,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import CreateWorkspace from "@/components/ui/create-workspace";
import { getWorkspaces } from "@/stores/getWorkspace";
import { workspaceEvents } from "@/stores/createWorkspace";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Workspace } from "@/types/workspace";
import { usePathname } from "next/navigation";
import { Folder } from "lucide-react";
import Link from "next/link";
import SettingsWorkspace from "@/components/ui/settings-workspace";

function workspaces() {
  const { data, loading, error, fetchData } = getWorkspaces();
  const { toast } = useToast();
  const pathname = usePathname();

  useEffect(() => {
    const fetchAllWorkspaces = async () => {
      await fetchData();
    };
    fetchAllWorkspaces();

    workspaceEvents.onWorkspaceCreated = fetchAllWorkspaces;
    return () => {
      workspaceEvents.onWorkspaceCreated = null;
    };
  }, [fetchData]);

  if (loading) {
    return <Skeleton />;
  }

  if (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description:
        "An error occurred while loading projects. Please try again later.",
    });
  }

  return (
    <SidebarContent>
      <SidebarGroupLabel className="w-full flex justify-between">
        <p>Projects</p>
        <CreateWorkspace />
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {data && data?.workspaces?.length > 0
            ? data?.workspaces.map((workspace: Workspace) => {
                const isActive = pathname.includes(
                  `/dashboard/workspaces/${workspace._id}`
                );
                return (
                  <SidebarMenuItem key={workspace._id}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={`/dashboard/workspaces/${workspace._id}`}
                        className={`group flex items-center gap-2 w-full p-2 rounded-md transition-all ${
                          isActive ? "bg-gray-100" : ""
                        }`}
                      >
                        <Folder />
                        <div className="flex items-center justify-between w-full">
                          {workspace.title || "Unknown"}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <SettingsWorkspace
                              title={workspace.title}
                              id={workspace._id}
                            />
                          </div>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })
            : null}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarContent>
  );
}

export default workspaces;
