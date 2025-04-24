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
import { Ellipsis } from "lucide-react";
import RenameWorkspace from "@/components/ui/rename-workspace";
import DeleteWorkspace from "@/components/ui/delete-workspace";

function SettingsWorkspace({ title, id }: any) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis size={14} className="text-neutral-500" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <RenameWorkspace id={id} title={title} />
        <DeleteWorkspace id={id} title={title} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default SettingsWorkspace;
