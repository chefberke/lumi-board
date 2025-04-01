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

function CreateWorkspace() {
  return (
    <Dialog>
      <DialogTrigger>
        <Plus
          size={14}
          className="hover:text-black hover:cursor-pointer transition-all"
        />
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
          <input
            //   value={workspaceName}
            //   onChange={(e) => setWorkspaceName(e.target.value)}
            maxLength={15}
            type="text"
            className="mt-2 w-64 border border-gray-300 bg-gray-100 shadow rounded-md px-3 py-1 focus:outline-[#4B4EE7]"
          />
          <div className="pt-3 flex items-center gap-2">
            <Checkbox id="defaultValues" disabled checked={true} />
            <p className="text-neutral-700 text-sm">Default Columns</p>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" size={"sm"}>
              Close
            </Button>
          </DialogClose>
          <Button variant="default" size={"sm"}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateWorkspace;
