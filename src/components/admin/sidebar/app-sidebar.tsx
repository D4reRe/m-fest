"use client";
import { NavMain } from "@/components/admin/sidebar/nav-main";
import { NavUser } from "@/components/admin/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { dataNavSidebarAdmin as dataNavSidebar } from "@/constants/constants";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="offcanvas"
      {...props}
      className="bg-transparent backdrop-blur-lg border-r-1"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-8 hover:scale-105 transition-all"
            >
              <Link
                href="/"
                aria-label="home"
                className="flex items-center gap-4 space-x-2"
                prefetch
              >
                <Image
                  src="/logo.svg"
                  alt="Mechanical Festival 2025"
                  width={80}
                  height={80}
                />
                <Image src="/hmm.png" alt="HMM ITB" width={45} height={45} />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-transparent backdrop-blur-3xl ">
        <NavMain items={dataNavSidebar.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
