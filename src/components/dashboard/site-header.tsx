"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

import { usePathname } from "next/navigation";
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
              <BreadcrumbLink asChild>
                <Link
                  href="/dashboard"
                  className={pathname === "/dashboard" ? "text-foreground" : ""}
                >
                  Dashboard
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {pathname === "/dashboard/profile" ? (
              <>
                <BreadcrumbSeparator />
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
                <BreadcrumbSeparator />
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
                <BreadcrumbSeparator />
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
                <BreadcrumbSeparator />
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
            ) : null}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
