"use client";

import React from "react";
import { Plus } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { createWorkspace } from "@/stores/createWorkspace";
import { Input } from "@/components/ui/input";

function WorkspaceCreateDialog() {
  const [workspaceName, setWorkspaceName] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const { error, fetchData } = createWorkspace();
  const { toast } = useToast();

  async function handleCreateWorkspace() {
    if (workspaceName.trim() === "") {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Project name cannot be empty.",
      });
      return;
    }

    try {
      await fetchData(workspaceName);

      toast({
        variant: "success",
        title: "Success",
        description: "Project has been established successfully.",
      });

      setOpen(false);
      setWorkspaceName("");
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Project could not be established. Please try again later.",
      });
    }
  }

  React.useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Project could not be established. Please try again later.",
      });
    }
  }, [error, toast]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button">
          <Plus
            size={14}
            className="hover:text-black hover:cursor-pointer transition-all"
          />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create A New Project</DialogTitle>
          <DialogDescription>
            Start a new project quickly and organize your tasks efficiently.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full">
          <p className="text-sm text-neutral-700">Workspace Name</p>
          <Input
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            maxLength={15}
            type="text"
            className="mt-2.5 w-64 bg-neutral-50"
          />
          <div className="pt-3 flex items-center gap-2">
            <Checkbox id="defaultValues" disabled checked={true} />
            <p className="text-neutral-700 text-sm">Default Columns</p>
          </div>

          <div className="pt-2 text-red-600">{error}</div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" size={"sm"}>
              Close
            </Button>
          </DialogClose>
          <Button variant="default" size={"sm"} onClick={handleCreateWorkspace}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default WorkspaceCreateDialog;
