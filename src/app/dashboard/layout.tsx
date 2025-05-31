import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarNavigation } from "@/components/shared/SidebarNavigation";
import DashboardBreadcrumbs from "@/components/shared/DashboardBreadcrumbs";
import OnboardingGuide from "@/components/shared/OnboardingGuide";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SidebarNavigation />
      <main className="h-screen overflow-hidden flex flex-col w-full">
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
