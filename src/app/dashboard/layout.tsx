import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/dashboard-sidebar";
import PathCrumb from "@/components/ui/path";
import Onboarding from "@/components/ui/onboarding";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="h-screen overflow-hidden flex flex-col w-full">
        <SidebarTrigger />
        <div className="flex-1 overflow-hidden p-6">
          <div className="mb-6">
            <PathCrumb />
          </div>
          <Onboarding />
          <div className="mt-2 h-[calc(100%-4rem)] overflow-hidden">
            {children}
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}
