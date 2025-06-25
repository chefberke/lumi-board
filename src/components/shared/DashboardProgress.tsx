"use client";

import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { getWorkspaces } from "@/stores/getWorkspace";
import { Skeleton } from "@/components/ui/skeleton";

interface TaskData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

function DashboardProgress() {
  const {
    data: workspacesData,
    loading: workspacesLoading,
    fetchData: fetchWorkspaces,
  } = getWorkspaces();

  const [taskData, setTaskData] = useState<TaskData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalTasks, setTotalTasks] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (fetchWorkspaces) await fetchWorkspaces();
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      }
    };

    loadData();
  }, [fetchWorkspaces]);

  useEffect(() => {
    const calculateTaskDistribution = async () => {
      if (!workspacesData?.workspaces) {
        setLoading(false);
        return;
      }

      const workspaces = workspacesData.workspaces;
      let todoTasks = 0;
      let inProgressTasks = 0;
      let doneTasks = 0;

      const statsPromises = workspaces.map(async (workspace) => {
        try {
          const response = await fetch(`/api/workspaces/${workspace._id}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch workspace ${workspace._id}`);
          }

          const workspaceData = await response.json();

          let workspaceTodo = 0;
          let workspaceInProgress = 0;
          let workspaceDone = 0;

          if (workspaceData.workspace?.columns) {
            for (const column of workspaceData.workspace.columns) {
              if (column.cards) {
                const columnTitle = column.title.toLowerCase();
                const cardCount = column.cards.length;

                if (
                  columnTitle.includes("todo") ||
                  columnTitle.includes("to do") ||
                  columnTitle.includes("backlog")
                ) {
                  workspaceTodo += cardCount;
                } else if (
                  columnTitle.includes("progress") ||
                  columnTitle.includes("doing") ||
                  columnTitle.includes("in progress")
                ) {
                  workspaceInProgress += cardCount;
                } else if (
                  columnTitle.includes("done") ||
                  columnTitle.includes("completed") ||
                  columnTitle.includes("finished")
                ) {
                  workspaceDone += cardCount;
                } else {
                  // Default kategorilendirme: ilk column todo, son column done, diğerleri in progress
                  const columnIndex =
                    workspaceData.workspace.columns.indexOf(column);
                  const totalColumns = workspaceData.workspace.columns.length;

                  if (columnIndex === 0) {
                    workspaceTodo += cardCount;
                  } else if (columnIndex === totalColumns - 1) {
                    workspaceDone += cardCount;
                  } else {
                    workspaceInProgress += cardCount;
                  }
                }
              }
            }
          }

          return {
            todo: workspaceTodo,
            inProgress: workspaceInProgress,
            done: workspaceDone,
          };
        } catch (error) {
          console.error(
            `Error fetching data for workspace ${workspace._id}:`,
            error
          );
          return { todo: 0, inProgress: 0, done: 0 };
        }
      });

      const results = await Promise.all(statsPromises);

      results.forEach((result) => {
        todoTasks += result.todo;
        inProgressTasks += result.inProgress;
        doneTasks += result.done;
      });

      const total = todoTasks + inProgressTasks + doneTasks;
      setTotalTasks(total);

      const data: TaskData[] = [
        {
          name: "Done",
          value: doneTasks,
          percentage: total > 0 ? Math.round((doneTasks / total) * 100) : 0,
          color: "#c084fc", // açık mor - purple-400
        },
        {
          name: "In Progress",
          value: inProgressTasks,
          percentage:
            total > 0 ? Math.round((inProgressTasks / total) * 100) : 0,
          color: "#8b5cf6", // orta mor - violet-500
        },
        {
          name: "Todo",
          value: todoTasks,
          percentage: total > 0 ? Math.round((todoTasks / total) * 100) : 0,
          color: "#6366f1", // koyu mor - indigo-500
        },
      ];

      setTaskData(data);
      setLoading(false);
    };

    if (!workspacesLoading) {
      calculateTaskDistribution();
    }
  }, [workspacesData, workspacesLoading]);

  // Custom label function for pie chart
  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
    if (
      !cx ||
      !cy ||
      midAngle === undefined ||
      !innerRadius ||
      !outerRadius ||
      percent === undefined
    ) {
      return null;
    }

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="12"
        fontWeight="500"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Custom tooltip
  const CustomTooltip = (props: any) => {
    const { active, payload } = props;
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{data.name}</p>
          <p className="text-neutral-300">{`Tasks: ${data.value}`}</p>
          <p className="text-neutral-300">{`Percentage: ${data.percentage}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={`
      relative overflow-hidden
      backdrop-blur-sm bg-neutral-900
      border border-neutral-900
      rounded-xl p-6

      cursor-pointer group
      h-[320px] flex flex-col
    `}
    >
      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {loading ? (
          <>
            {/* Header skeleton */}
            <div className="flex items-center space-x-2 mb-4">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>

            {/* Chart skeleton */}
            <div className="h-32 mb-4 flex justify-center">
              <Skeleton className="h-28 w-28 rounded-full" />
            </div>

            {/* Legend skeleton */}
            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-8" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-4 w-8" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-4 w-8" />
              </div>
            </div>
          </>
        ) : totalTasks === 0 ? (
          <>
            {/* Header with icon and title */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-4 h-4 rounded-full border-2 border-neutral-400"></div>
              <h3 className="text-sm font-medium text-neutral-400 group-hover:text-white transition-colors">
                Progress Distribution
              </h3>
            </div>

            {/* Empty state */}
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-neutral-600 flex items-center justify-center mb-4">
                <div className="w-8 h-8 rounded-full border-2 border-neutral-600"></div>
              </div>
              <p className="text-neutral-400 text-sm mb-1">No tasks yet</p>
              <p className="text-neutral-500 text-xs">
                Create some tasks to see progress
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Header with icon and title */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-4 h-4 rounded-full border-2 border-neutral-400"></div>
              <h3 className="text-sm font-medium text-neutral-400 group-hover:text-white transition-colors">
                Progress Distribution
              </h3>
            </div>

            {/* Donut Chart */}
            <div className="h-32 mt-2 mb-6 flex justify-center">
              <ResponsiveContainer width={140} height="100%">
                <PieChart>
                  <Pie
                    data={taskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    startAngle={90}
                    endAngle={450}
                    paddingAngle={6}
                    cornerRadius={4}
                    stroke="none"
                  >
                    {taskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="space-y-2 flex-1 px-2">
              {taskData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-white text-sm">{item.name}</span>
                  </div>
                  <span className="text-neutral-200 text-sm font-medium">
                    %{item.percentage}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
}

export default DashboardProgress;
