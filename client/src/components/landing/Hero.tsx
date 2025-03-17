import React from "react";
import Columns from "@/components/kanban/Columns";

export default function Hero() {
  return (
    <div className="w-full h-screen relative">
      <div className="absolute inset-0 -z-1 h-[80vh] w-full mx-auto bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_90%)] [mask-size:100%_100%] [mask-repeat:no-repeat]">
        {" "}
      </div>
      <div className="w-full h-full flex flex-col items-center justify-center relative">
        <div className="flex flex-col items-center justify-center pt-12">
          <h2 className="text-center text-7xl font-black">
            <span className="bg-gradient-to-r from-primary to-black bg-clip-text text-transparent">
              Lumi
            </span>{" "}
            Kanban
          </h2>
          <p className="text-center text-gray-600 mt-4 max-w-lg">
            A beautiful and intuitive kanban board that helps you organize your
            tasks and projects with ease, providing you with a smooth and
            delightful user experience.
          </p>
        </div>
        <div className="relative w-full flex-1 flex items-start justify-center pt-8">
          <Columns />
        </div>
      </div>
    </div>
  );
}
