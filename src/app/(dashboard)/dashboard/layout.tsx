import { auth } from "@/auth";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SiteHeader } from "@/components/dashboard/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      className={`min-h-screen bg-[url("/landing.png")] bg-cover bg-center bg-fixed bg-repeat`}
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="bg-transparent backdrop-blur-lg">
        <SiteHeader />

        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
