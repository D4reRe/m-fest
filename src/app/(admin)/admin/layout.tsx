"use client";

import { AppSidebar } from "@/components/admin/sidebar/app-sidebar";
import { SiteHeader } from "@/components/admin/sidebar/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
// @ts-expect-error ReactDrop.css exist
import "react-image-crop/dist/ReactCrop.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      className={`min-h-screen bg-[url("/landing.webp")] bg-cover bg-center bg-fixed bg-repeat`}
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="bg-transparent backdrop-blur-lg">
        <SiteHeader />

        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
