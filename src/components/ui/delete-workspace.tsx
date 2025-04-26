"use client";

import { Trash } from "lucide-react";
import React, { useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { delWorkspace } from "@/stores/deleteWorkspace";
import { toast } from "@/hooks/use-toast";
import { getWorkspaces } from "@/stores/getWorkspace";
import { useRouter } from "next/navigation";

function DeleteWorkspace({ id, title }: { id: string; title: string }) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const { error, fetchData: deleteData } = delWorkspace();
  const { fetchData: fetchWorkspaces } = getWorkspaces();

  async function handleDelete() {
    await deleteData(id);
    await fetchWorkspaces();
    toast({
      variant: "destructive",
      title: "Deleted",
      description: "Project deleted successfully.",
    });
    router.push("/dashboard");
    localStorage.removeItem("recentWorkspaces");
    setOpen(false);
  }

  if (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Project could not be established. Please try again later.",
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="hover:cursor-pointer"
        >
          <Trash className="text-red-500 mr-2" />
          Delete
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to delete{" "}
            <span className="text-lumi">{title}</span> workspace?
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. Your workspace and its data will be
            permanently removed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline" size={"sm"}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="default"
            size={"sm"}
            onClick={handleDelete}
            className="bg-lumi"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteWorkspace;
