"use client";

import { Calendar, Home, Inbox } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Image from "next/image";
import Logo from "@/assets/logo.svg";
import LogoDark from "@/assets/logo_dark.svg";
import UserSettingsFooter from "@/components/shared/UserSettingsFooter";
import WorkspaceList from "@/components/shared/WorkspaceList";
import { useTheme } from "next-themes";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
    live: true,
  },
  {
    title: "Inbox",
    url: "/dashboard/inbox",
    icon: Inbox,
    live: true,
  },
  {
    title: "Calendar",
    url: "/dashboard/calendar",
    icon: Calendar,
    live: true,
  },
];

export function SidebarNavigation() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Sidebar className="p-4 border-r-neutral-800">
      <SidebarContent>
        <SidebarGroup>
          <Image
            src={mounted && resolvedTheme === "dark" ? LogoDark : Logo}
            width={75}
            height={75}
            alt="Logo"
          />
        </SidebarGroup>

        <SidebarGroupLabel>Overview</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => {
              const isActive = pathname === item.url;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={`flex items-center gap-2 w-full p-2 rounded-md transition-all ${
                        isActive
                          ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white"
                          : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                      }
                      ${!item.live && "cursor-not-allowed"}
                      `}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                      {!item.live && (
                        <span className="bg-lumi text-white rounded-md px-1 py-0.5 font-medium text-xs">
                          Soon
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>

        <WorkspaceList />
      </SidebarContent>

      <UserSettingsFooter />
    </Sidebar>
  );
}
