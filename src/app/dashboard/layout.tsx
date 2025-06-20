"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarNavigation } from "@/components/shared/SidebarNavigation";
import DashboardBreadcrumbs from "@/components/shared/DashboardBreadcrumbs";
import OnboardingGuide from "@/components/shared/OnboardingGuide";
import { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { usePathname, useSearchParams } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.configure({ showSpinner: false });
  }, []);

  useEffect(() => {
    NProgress.start();
    NProgress.done();
  }, [pathname, searchParams]);

  return (
    <SidebarProvider>
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
