"use client";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

const menus = [
  {
    title: "Dashboard",
    url: "/dashboard",
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
  },
  {
    title: "Events",
    url: "/dashboard/events",
  },
  {
    title: "Competitions",
    url: "/dashboard/competitions",
  },
  {
    title: "Team",
    url: "/dashboard/team",
  },
  {
    title: "Invoices",
    url: "/dashboard/invoices",
  },
];

import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SlashIcon } from "lucide-react";
export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />

        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger>Dashboard</DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {menus.map((menu) => (
                    <Link key={menu.title} href={menu.url}>
                      <DropdownMenuItem>{menu.title}</DropdownMenuItem>
                    </Link>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            {pathname === "/dashboard/profile" ? (
              <>
                <BreadcrumbSeparator>
                  <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href="/dashboard/profile"
                      className={
                        pathname === "/dashboard/profile"
                          ? "text-foreground"
                          : ""
                      }
                    >
                      Profile
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            ) : pathname === "/dashboard/competitions" ? (
              <>
                <BreadcrumbSeparator>
                  <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href="/dashboard/competitions"
                      className={
                        pathname === "/dashboard/competitions"
                          ? "text-foreground"
                          : ""
                      }
                    >
                      Competitions
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            ) : pathname === "/dashboard/team" ? (
              <>
                <BreadcrumbSeparator>
                  <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href="/dashboard/team"
                      className={
                        pathname === "/dashboard/team" ? "text-foreground" : ""
                      }
                    >
                      Team
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            ) : pathname === "/dashboard/events" ? (
              <>
                <BreadcrumbSeparator>
                  <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href="/dashboard/events"
                      className={
                        pathname === "/dashboard/events"
                          ? "text-foreground"
                          : ""
                      }
                    >
                      Events
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            ) : pathname === "/dashboard/invoices" ? (
              <>
                <BreadcrumbSeparator>
                  <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href="/dashboard/events"
                      className={
                        pathname === "/dashboard/invoices"
                          ? "text-foreground"
                          : ""
                      }
                    >
                      Invoices
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            ) : null}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
