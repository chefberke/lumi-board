"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarNavigation } from "@/components/shared/SidebarNavigation";
import DashboardBreadcrumbs from "@/components/shared/DashboardBreadcrumbs";
import OnboardingGuide from "@/components/shared/OnboardingGuide";
import { useEffect } from "react";

function ThemeInitializer() {
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return null;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <ThemeInitializer />
      <SidebarNavigation />
      <main className="h-screen overflow-hidden flex flex-col w-full dark:bg-neutral-950">
        <SidebarTrigger />
        <div className="flex-1 overflow-hidden p-6">
          <div className="mb-6">
            <DashboardBreadcrumbs />
          </div>
          <OnboardingGuide />
          <div className="mt-2 h-[calc(100%-4rem)] overflow-hidden">
            {children}
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}
