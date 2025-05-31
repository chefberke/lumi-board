import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Ellipsis, UserRound } from "lucide-react";
import WorkspaceRenameDialog from "@/components/shared/WorkspaceRenameDialog";
import WorkspaceDeleteDialog from "@/components/shared/WorkspaceDeleteDialog";

function WorkspaceSettingsPanel({ title, id }: any) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis size={14} className="text-neutral-500" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <WorkspaceRenameDialog id={id} title={title} />
        <WorkspaceDeleteDialog id={id} title={title} />

        <DropdownMenuItem disabled className="hover:cursor-not-allowed">
          <UserRound className="mr-2" />
          <span className="mr-2">Add User</span>
          {/* <span className="bg-lumi text-white rounded-md px-1 py-0.5 font-medium text-xs">
            Soon
          </span> */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default WorkspaceSettingsPanel;
