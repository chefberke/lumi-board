"use client";

import DashboardCard from "@/components/shared/DashboardCard";
import DashboardProgress from "@/components/shared/DashboardProgress";
import DashboardWelcomer from "@/components/shared/DashboardWelcomer";
import React, { useEffect } from "react";

function Dashboard() {
  useEffect(() => {
    document.title = "Lumi | Dashboard";
  }, []);

  return (
    <div>
      <DashboardWelcomer />
      <DashboardCard />
      <div className="w-full mt-5">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <DashboardProgress />
          </div>
          <div className="relative overflow-hidden col-span-3 backdrop-blur-sm bg-neutral-900 border border-neutral-900 rounded-xl p-6 min-h-[120px] flex flex-col justify-center items-center">
            <p className="text-neutral-400 text-sm">Coming Soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
