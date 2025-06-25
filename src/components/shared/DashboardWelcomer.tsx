"use client";

import { getMe } from "@/stores/getMe";
import React, { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function DashboardWelcomer() {
  const { data, loading, error, fetchData } = getMe();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading || error || !data)
    return <Skeleton className="h-10 w-72 rounded-lg" />;

  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-xl font-medium">
        Welcome back, {data.user.username}!
      </h1>
      <p className="text-sm text-muted-foreground">
        You've got some tasks to complete.
      </p>
    </div>
  );
}

export default DashboardWelcomer;
