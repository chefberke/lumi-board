"use client";

import { Calendar, Home, Inbox } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

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
import SidebarFooters from "./sidebar-footer";
import Workspaces from "@/components/ui/workspaces";

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
    live: false,
  },
  {
    title: "Calendar",
    url: "/dashboard/calendar",
    icon: Calendar,
    live: false,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="p-4">
      <SidebarContent>
        <SidebarGroup>
          <Image src={Logo} width={80} height={80} alt="Logo" />
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
                          ? "bg-neutral-100 text-neutral-900"
                          : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                      }`}
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

        <Workspaces />
      </SidebarContent>

      <SidebarFooters />
    </Sidebar>
  );
}
