import { PencilLine } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateWorkspace } from "@/stores/updateWorkspace";
import { getWorkspaces } from "@/stores/getWorkspace";
import { toast } from "@/hooks/use-toast";

function WorkspaceRenameDialog({ id, title }: { id: string; title: string }) {
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showModal) {
      setNewTitle(title);
      // Modal açıldıktan sonra input'a odaklanmak için bir timeout kullanıyoruz
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);

      // Dışarıya tıklandığında modalı kapatmak için event listener ekliyoruz
      const handleClickOutside = (event: MouseEvent) => {
        if (
          modalRef.current &&
          !modalRef.current.contains(event.target as Node)
        ) {
          setShowModal(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showModal, title]);

  const { error, fetchData: renameWorkspace } = updateWorkspace();
  const { fetchData: fetchWorkspaces } = getWorkspaces();

  const handleRename = async () => {
    if (!newTitle) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Project name cannot be empty.",
      });
      return;
    }

    if (title === newTitle) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Project name cannot be same as current name.",
      });
      return;
    }

    await renameWorkspace?.(id, newTitle);
    await fetchWorkspaces?.();
    toast({
      variant: "success",
      title: "Renamed",
      description: "Project renamed successfully.",
    });

    setShowModal(false);
  };

  if (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Project could not be renamed. Please try again later.",
    });
  }

  const openModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(true);
  };

  return (
    <>
      <DropdownMenuItem
        className="hover:cursor-pointer"
        onSelect={(e) => {
          e.preventDefault();
        }}
        onClick={openModal}
      >
        <PencilLine className="mr-2" />
        Rename
      </DropdownMenuItem>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-lg p-6 shadow-lg dark:bg-neutral-900"
          >
            <h2 className="text-xl font-semibold mb-2">Rename Workspace</h2>
            <p className="text-neutral-600 text-sm mb-4 dark:text-neutral-300">
              Enter a new name for your workspace. This action cannot be undone.
            </p>

            <div className="mb-4">
              <label className="text-sm text-neutral-700 block mb-2 dark:text-neutral-100">
                New workspace name
              </label>
              <Input
                ref={inputRef}
                value={newTitle}
                maxLength={15}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-neutral-50"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size={"sm"}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size={"sm"}
                onClick={handleRename}
                className="bg-lumi"
              >
                Rename
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default WorkspaceRenameDialog;
