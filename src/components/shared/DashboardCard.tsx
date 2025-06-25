"use client";

import { FolderOpen, ListTodo, UserCheck, CheckCircle2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { getWorkspaces } from "@/stores/getWorkspace";
import { useKanbanStore } from "@/stores/kanbanStore";
import { getMe } from "@/stores/getMe";
import { Skeleton } from "@/components/ui/skeleton";

function DashboardCard() {
  const {
    data: workspacesData,
    loading: workspacesLoading,
    fetchData: fetchWorkspaces,
  } = getWorkspaces();
  const {
    data: userData,
    loading: userLoading,
    fetchData: fetchUser,
  } = getMe();
  const { fetchData: fetchKanbanData } = useKanbanStore();

  const [stats, setStats] = useState({
    totalWorkspaces: 0,
    totalTasks: 0,
    assignedToYou: 0,
    completedTasks: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (fetchWorkspaces) await fetchWorkspaces();
        if (fetchUser) await fetchUser();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    loadData();
  }, [fetchWorkspaces, fetchUser]);

  useEffect(() => {
    const calculateStats = async () => {
      if (!workspacesData?.workspaces || !userData?.user) {
        console.log("Missing data:", { workspacesData, userData });
        setLoading(false);
        return;
      }

      const workspaces = workspacesData.workspaces;
      const currentUser = userData.user;

      console.log("Calculating stats for workspaces:", workspaces.length);
      console.log("Current user:", currentUser);

      let totalTasks = 0;
      let assignedToYou = 0;
      let completedTasks = 0;

      const statsPromises = workspaces.map(async (workspace) => {
        try {
          console.log(
            `Fetching detailed data for workspace: ${workspace._id} (${workspace.title})`
          );

          const response = await fetch(`/api/workspaces/${workspace._id}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch workspace ${workspace._id}`);
          }

          const workspaceData = await response.json();
          console.log(`Workspace data for ${workspace._id}:`, workspaceData);

          let workspaceTasks = 0;
          let workspaceAssigned = 0;
          let workspaceCompleted = 0;

          if (workspaceData.workspace?.columns) {
            for (const column of workspaceData.workspace.columns) {
              console.log(
                `Column: ${column.title}, Cards: ${column.cards?.length || 0}`
              );

              if (column.cards) {
                for (const card of column.cards) {
                  workspaceTasks++;

                  console.log(
                    `Card: ${card.title}, Assignee: ${
                      card.assignee?.username || "None"
                    }`
                  );

                  if (card.assignee?._id === currentUser._id) {
                    workspaceAssigned++;
                  }

                  if (column.title.toLowerCase() === "done") {
                    workspaceCompleted++;
                  }
                }
              }
            }
          }

          return {
            tasks: workspaceTasks,
            assigned: workspaceAssigned,
            completed: workspaceCompleted,
          };
        } catch (error) {
          console.error(
            `Error fetching data for workspace ${workspace._id}:`,
            error
          );
          return { tasks: 0, assigned: 0, completed: 0 };
        }
      });

      const results = await Promise.all(statsPromises);

      results.forEach((result) => {
        totalTasks += result.tasks;
        assignedToYou += result.assigned;
        completedTasks += result.completed;
      });

      console.log("Final stats:", {
        totalWorkspaces: workspaces.length,
        totalTasks,
        assignedToYou,
        completedTasks,
      });

      setStats({
        totalWorkspaces: workspaces.length,
        totalTasks,
        assignedToYou,
        completedTasks,
      });

      setLoading(false);
    };

    if (!workspacesLoading && !userLoading) {
      calculateStats();
    }
  }, [workspacesData, userData, workspacesLoading, userLoading]);

  const cards = [
    {
      title: "Total Workspaces",
      count: stats.totalWorkspaces,
      icon: <FolderOpen className="w-6 h-6" />,
      bgGradient: "from-blue-600/20 to-blue-800/20",
      iconColor: "text-blue-400",
      borderColor: "border-blue-500/30",
    },
    {
      title: "Total Tasks",
      count: stats.totalTasks,
      icon: <ListTodo className="w-6 h-6" />,
      bgGradient: "from-purple-600/20 to-purple-800/20",
      iconColor: "text-purple-400",
      borderColor: "border-purple-500/30",
    },
    {
      title: "Assigned to You",
      count: stats.assignedToYou,
      icon: <UserCheck className="w-6 h-6" />,
      bgGradient: "from-orange-600/20 to-orange-800/20",
      iconColor: "text-orange-400",
      borderColor: "border-orange-500/30",
    },
    {
      title: "Completed Tasks",
      count: stats.completedTasks,
      icon: <CheckCircle2 className="w-6 h-6" />,
      bgGradient: "from-green-600/20 to-green-800/20",
      iconColor: "text-green-400",
      borderColor: "border-green-500/30",
    },
  ];

  return (
    <div className="w-full mt-5">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <Card
            key={index}
            title={card.title}
            count={card.count}
            icon={card.icon}
            loading={loading}
          />
        ))}
      </div>
    </div>
  );
}

function Card({
  title,
  count,
  icon,
  loading,
}: {
  title: string;
  count: number;
  icon: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <div
      className={`
      relative overflow-hidden
      backdrop-blur-sm bg-neutral-900
      border border-neutral-900
      rounded-xl p-6

      cursor-pointer group
      min-h-[120px] flex flex-col justify-between
    `}
    >
      {/* Content */}
      <div className="relative z-10">
        {loading ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-6" />
            </div>
            <Skeleton className="h-8 w-16" />
          </div>
        ) : (
          <>
            {/* Header with title and icon */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-neutral-400 group-hover:text-white transition-colors">
                {title}
              </h3>
              <div
                className={`group-hover:scale-110 transition-transform duration-300`}
              >
                {icon}
              </div>
            </div>

            <div className="flex items-baseline">
              <span className="text-2xl font-semibold text-white group-hover:text-gray-100 transition-colors">
                {count}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
}

export default DashboardCard;
