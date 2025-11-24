"use client";

import { type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Key } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const pathname = usePathname();
  const trpc = useTRPC();
  const { data: user } = useQuery(trpc.dashboard.getUser.queryOptions());
  return (
    <SidebarGroup className="bg-transparent backdrop-blur-lg">
      <SidebarGroupContent className="flex flex-col gap-2 bg-transparent backdrop-blur-lg ">
        <SidebarMenu></SidebarMenu>
        <SidebarMenu>
          {user?.role === "SUPERADMIN" && (
            <Link href={"/admin"} prefetch>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Admin Panel"
                  className={`hover:bg-white/30 cursor-pointer`}
                >
                  <Key className="w-4 h-4" />
                  <span>Admin Panel</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </Link>
          )}
          {user?.role === "ADMIN" && (
            <Link href={"/admin"} prefetch>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Admin Panel"
                  className={`hover:bg-white/30 cursor-pointer`}
                >
                  <Key className="w-4 h-4" />
                  <span>Admin Panel</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </Link>
          )}
          {items.map((item) => (
            <Link href={item.url} key={item.title} prefetch>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={item.title}
                  className={`hover:bg-white/30 cursor-pointer ${
                    pathname === item.url ? "bg-white/15" : ""
                  }`}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </Link>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
