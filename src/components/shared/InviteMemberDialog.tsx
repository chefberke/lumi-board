import { UserRound } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { inviteMember } from "@/stores/inviteMember";
import { toast } from "@/hooks/use-toast";

function InviteMemberDialog({ id, title }: { id: string; title: string }) {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { error, fetchData: inviteData } = inviteMember();

  useEffect(() => {
    if (showModal) {
      setEmail("");
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
  }, [showModal]);

  const handleInvite = async () => {
    if (!email.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Email cannot be empty.",
      });
      return;
    }

    try {
      await inviteData?.(id, email);
      toast({
        variant: "success",
        title: "Success",
        description: "Invitation sent successfully.",
      });
      setShowModal(false);
      setEmail("");
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send invitation. Please try again later.",
      });
    }
  };

  if (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to send invitation. Please try again later.",
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
        <UserRound className="mr-2" />
        Invite Member
      </DropdownMenuItem>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-lg p-6 shadow-lg dark:bg-neutral-900"
          >
            <h2 className="text-xl font-semibold mb-2">Invite Member</h2>
            <p className="text-neutral-600 text-sm mb-4 dark:text-neutral-300">
              Enter the email address of the person you want to invite to{" "}
              <span className="text-lumi">{title}</span> workspace.
            </p>

            <div className="mb-4">
              <label className="text-sm text-neutral-700 block mb-2 dark:text-neutral-100">
                Email Address
              </label>
              <Input
                ref={inputRef}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter email address"
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
                onClick={handleInvite}
                className="bg-lumi"
              >
                Send Invitation
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default InviteMemberDialog;
