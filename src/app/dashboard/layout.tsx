import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/dashboard-sidebar";
import PathCrumb from "@/components/ui/path";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <div className="p-6">
          <PathCrumb />
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
