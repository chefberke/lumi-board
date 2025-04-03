import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/dashboard-sidebar";
import PathCrumb from "@/components/ui/path";
import Onboarding from "@/components/ui/onboarding";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <div className="p-6">
          <PathCrumb />
          <Onboarding />
          <div className="pt-4">{children}</div>
        </div>
      </main>
    </SidebarProvider>
  );
}
