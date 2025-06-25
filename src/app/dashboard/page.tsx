"use client";

import DashboardCard from "@/components/shared/DashboardCard";
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
    </div>
  );
}

export default Dashboard;
