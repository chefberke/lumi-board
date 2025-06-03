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
import InviteMemberDialog from "@/components/shared/InviteMemberDialog";

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

        <InviteMemberDialog id={id} title={title} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default WorkspaceSettingsPanel;
