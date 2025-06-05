import React from "react";
import { getUser } from "@/lib/authClient";

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
import LeaveWorkspaceDialog from "@/components/shared/LeaveWorkspaceDialog";

function WorkspaceSettingsPanel({
  title,
  id,
  ownerId,
}: {
  title: string;
  id: string;
  ownerId: string;
}) {
  const user = getUser();
  const isOwner = user?.id === ownerId;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis size={14} className="text-neutral-500" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {isOwner ? (
          <>
            <WorkspaceRenameDialog id={id} title={title} />
            <WorkspaceDeleteDialog id={id} title={title} />
            <InviteMemberDialog id={id} title={title} />
          </>
        ) : (
          <LeaveWorkspaceDialog id={id} title={title} />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default WorkspaceSettingsPanel;
