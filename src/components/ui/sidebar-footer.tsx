"use client";

import React, { useEffect } from "react";
import { getMe } from "@/stores/getMe";
import { signOut } from "@/stores/signOut";
import { Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function SidebarFooters() {
  const { data, error, fetchData } = getMe();
  const { toast } = useToast();

  useEffect(() => {
    const fetchGetMe = async () => {
      await fetchData();
    };
    fetchGetMe();
  }, [fetchData]);

  if (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description:
        "User information could not be retrieved. Please try again later.",
    });
  }

  const router = useRouter();

  async function signOutFunc() {
    try {
      await signOut.getState().fetchData();
      router.push("/sign-in");
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to exit successfully. Please try again later.",
      });
    }
  }

  return (
    <>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Dialog>
              <DialogTrigger className="w-full">
                <SidebarMenuButton asChild>
                  <span className="flex justify-between">
                    Profile
                    <Settings className="h-4 w-4" />
                  </span>
                </SidebarMenuButton>
              </DialogTrigger>
              {data && data?.user ? (
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Profile Settings</DialogTitle>
                    <DialogDescription>
                      Manage your account settings and preferences here.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center justify-start gap-4">
                    <Image
                      src={
                        "https://cdn.jsdelivr.net/gh/alohe/avatars/png/notion_1.png"
                      }
                      alt="user-image"
                      className="rounded-full border-2 border-black"
                      width={80}
                      height={80}
                    />
                    <div className="flex flex-col">
                      <div className="flex flex-col items-start justify-start pt-1">
                        <div className="text-neutral-500 text-sm">
                          Username:
                        </div>
                        <div className="text-neutral-800 pt-0.5">
                          @{data?.user?.username || "user"}
                        </div>
                      </div>
                      <div className="flex flex-col items-start justify-start pt-1">
                        <div className="text-neutral-500 text-sm">Email:</div>
                        <div className="text-neutral-800 pt-0.5">
                          {data?.user?.email || "lumiworks@info.com"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="default" size={"sm"} onClick={signOutFunc}>
                      Logout
                    </Button>
                  </DialogFooter>
                </DialogContent>
              ) : null}
            </Dialog>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}

export default SidebarFooters;
