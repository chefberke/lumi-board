import RecentActivity from "@/components/ui/recent-activity";
import YourTasks from "@/components/ui/your-tasks";
import Image from "next/image";
import React from "react";
import OfficeImage from "@/assets/office.png";

function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Home</h1>

      <div className="w-full relative pb-8">
        <div className="relative w-full h-64 rounded-2xl overflow-hidden">
          <Image
            src={OfficeImage}
            alt="office-img"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-purple-600 opacity-30" />

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h2 className="text-white text-3xl font-bold">We Hired!</h2>
            <p className="text-neutral-100 w-1/2 text-center">
              We're excited to announce that we've expanded our team.
            </p>
          </div>
        </div>
      </div>

      <YourTasks />
      <RecentActivity />
    </div>
  );
}

export default Dashboard;
