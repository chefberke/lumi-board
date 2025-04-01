import React from "react";

import { SidebarContent, SidebarGroupLabel } from "@/components/ui/sidebar";
import CreateWorkspace from "@/components/ui/create-workspace";

function workspaces() {
  return (
    <SidebarContent>
      <SidebarGroupLabel className="w-full flex justify-between">
        <p>Projects</p>
        <CreateWorkspace />
      </SidebarGroupLabel>
    </SidebarContent>
  );
}

export default workspaces;
