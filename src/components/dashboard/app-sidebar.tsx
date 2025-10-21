"use client";

import * as React from "react";
import {
  IconDashboard,
  IconListDetails,
  IconUsers,
  IconUser,
  IconConfetti,
  IconInvoice,
} from "@tabler/icons-react";

import { NavMain } from "@/components/dashboard/nav-main";
import { NavUser } from "@/components/dashboard/nav-user";
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

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: IconUser,
    },
    {
      title: "Events",
      url: "/dashboard/events",
      icon: IconConfetti,
    },
    {
      title: "Competitions",
      url: "/dashboard/competitions",
      icon: IconListDetails,
    },
    {
      title: "Team",
      url: "/dashboard/team",
      icon: IconUsers,
    },
    {
      title: "Invoices",
      url: "/dashboard/invoices",
      icon: IconInvoice,
    },
  ],
};

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
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
