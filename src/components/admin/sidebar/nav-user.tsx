"use client";

import { IconDotsVertical, IconLogout } from "@tabler/icons-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "../../general/UserProfile";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";
import { authClient } from "@/lib/auth-client";

export function NavUser() {
  const { isMobile } = useSidebar();
  const trpc = useTRPC();
  const { data: user, isFetched } = useQuery(
    trpc.dashboard.getUser.queryOptions()
  );
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  return (
    <SidebarMenu className="bg-transparent backdrop-blur-lg">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {isFetched ? (
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-white/20data-[state=open]:text-sidebar-accent-foreground hover:bg-white/20 "
              >
                <UserAvatar
                  src={user?.image as string}
                  alt={user?.name as string}
                  className="h-8 w-8 rounded-lg"
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <div className="flex items-center gap-2 w-full">
                    <span
                      className={cn(
                        "truncate font-medium",
                        user?.role === "SUPERADMIN"
                          ? "max-w-20"
                          : user?.role === "ADMIN"
                            ? "max-w-25"
                            : "w-full"
                      )}
                    >
                      {user?.name as string}
                    </span>
                    {user?.role === "ADMIN" && (
                      <span className="text-xs text-muted-foreground">
                        ADMIN
                      </span>
                    )}
                    {user?.role === "SUPERADMIN" && (
                      <span className="text-xs text-muted-foreground">
                        SUPERADMIN
                      </span>
                    )}
                  </div>
                  <span className="text-muted-foreground truncate text-xs">
                    {user?.email as string}
                  </span>
                </div>
                <IconDotsVertical className="ml-auto size-4" />
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-white/20data-[state=open]:text-sidebar-accent-foreground hover:bg-white/20 "
                disabled
              >
                <>
                  <Skeleton className="h-8 w-8 rounded-lg"></Skeleton>
                  <div className="grid flex-1 text-left text-sm leading-tight gap-2">
                    <Skeleton className="h-4 w-24 rounded-lg"></Skeleton>
                    <Skeleton className="h-4 w-32 rounded-lg"></Skeleton>
                  </div>
                  <IconDotsVertical className="ml-auto size-4" />
                </>
              </SidebarMenuButton>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg bg-white/10"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuItem
              variant="destructive"
              onClick={async () => {
                setIsLoading(true);
                toast.loading("Logging out...", {
                  id: "logging-out",
                });
                try {
                  await authClient.signOut();
                  toast.success("Logged out successfully");
                  toast.dismiss("logging-out");
                  router.replace("/");
                } catch (error) {
                  toast.error("Failed to log out");
                  console.error(error);
                } finally {
                  setIsLoading(false);
                }
              }}
              disabled={isLoading}
            >
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
