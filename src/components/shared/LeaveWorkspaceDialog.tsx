import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { API_URL } from "@/lib/config";
import { getWorkspaces } from "@/stores/getWorkspace";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";

function LeaveWorkspaceDialog({ id, title }: { id: string; title: string }) {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { fetchData: refreshWorkspaces } = getWorkspaces();

  const handleLeave = async () => {
    try {
      setIsLoading(true);
      await axios.post(`${API_URL}/api/workspaces/${id}/leave`);

      // Refresh workspaces after leaving
      await refreshWorkspaces?.();

      toast({
        title: "Success",
        description: "You have left the workspace successfully.",
      });
      router.push("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to leave the workspace. Please try again.",
      });
    } finally {
      setIsLoading(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <DropdownMenuItem
        className="text-red-500 hover:text-red-600 hover:bg-red-50"
        onSelect={(e) => {
          e.preventDefault();
          setShowModal(true);
        }}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Leave Workspace
      </DropdownMenuItem>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Workspace</DialogTitle>
            <DialogDescription>
              Are you sure you want to leave the workspace "{title}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowModal(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLeave}
              disabled={isLoading}
            >
              {isLoading ? "Leaving..." : "Leave Workspace"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default LeaveWorkspaceDialog;
