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
import { Ellipsis, PencilLine, Trash } from "lucide-react";

function SettingsWorkspace({ title, id }: any) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis size={14} className="text-neutral-500" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-neutral-700">
          <PencilLine /> Rename
        </DropdownMenuItem>
        <DropdownMenuItem className="text-neutral-700">
          <Trash className="text-red-500" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default SettingsWorkspace;
