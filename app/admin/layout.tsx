import {
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/admin/_components/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar/>
        <SidebarTrigger/>
        <main className="mx-10 py-10">
            {children}
        </main>
    </SidebarProvider>
  );
}
