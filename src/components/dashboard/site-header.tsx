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

import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SlashIcon } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { menus } from "@/constants/constants";
export function SiteHeader() {
  const pathname = usePathname();
  const [currentPathname, setCurrentPathname] = useState<string[]>([""]);
  useEffect(() => {
    setCurrentPathname(pathname.split("/").filter(Boolean));
  }, [pathname]);

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
                <DropdownMenuTrigger className="hover:cursor-pointer hover:text-foreground">
                  Dashboard
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {menus.map((menu) => (
                    <Link key={menu.title} href={menu.url}>
                      <DropdownMenuItem className="hover:cursor-pointer hover:text-foreground">
                        {menu.title}
                      </DropdownMenuItem>
                    </Link>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            {/* Index starts from 0 */}
            {currentPathname.slice(1).map((segment, index) => {
              const href = `/${currentPathname.slice(0, index + 2).join("/")}`;
              let title;
              if (segment.split("-")) {
                title = segment
                  .split("-")
                  .map((word) => {
                    return word.charAt(0).toUpperCase() + word.slice(1);
                  })
                  .join(" ");
              } else {
                title = segment.charAt(0).toUpperCase() + segment.slice(1);
              }
              const isLast = index === currentPathname.slice(1).length - 1;

              return (
                <Fragment key={href}>
                  <BreadcrumbSeparator>
                    <SlashIcon />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    {isLast ? (
                      <span className="text-foreground">{title}</span>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={href}>{title}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
