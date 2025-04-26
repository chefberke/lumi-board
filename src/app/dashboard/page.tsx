import RecentActivity from "@/components/ui/recent-activity";
import React from "react";

function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Home</h1>
      <RecentActivity />
    </div>
  );
}

export default Dashboard;
