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
  return (
    <SidebarGroup className="bg-transparent backdrop-blur-lg">
      <SidebarGroupContent className="flex flex-col gap-2 bg-transparent backdrop-blur-lg ">
        <SidebarMenu></SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <Link href={item.url} key={item.title} prefetch>
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  className={`hover:bg-white/30 ${
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
