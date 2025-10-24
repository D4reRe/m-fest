"use client";

import { IconDotsVertical, IconLogout } from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Skeleton } from "@heroui/react";
import { getUserProfile } from "@/action/user.action";
import { User } from "@prisma/client";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    (async () => {
      const data = await getUserProfile();
      setUser(data);
    })();
  }, []);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  return (
    <SidebarMenu className="bg-transparent backdrop-blur-lg">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {status === "authenticated" ? (
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-white/20data-[state=open]:text-sidebar-accent-foreground hover:bg-white/20 "
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={
                      (user?.image as string) ??
                      "https://api.iconify.design/healthicons/ui-user-profile-outline.svg?color=%23fff"
                    }
                    alt={(user?.name as string) ?? "User Image"}
                  />
                  <Image
                    src={
                      (user?.image as string) ??
                      "https://api.iconify.design/healthicons/ui-user-profile-outline.svg?color=%23fff"
                    }
                    alt={(user?.name as string) ?? "User Image"}
                    width={32}
                    height={32}
                    className="object-cover object-center rounded-full"
                  />
                  <AvatarFallback className="rounded-lg h-8 w-8 bg-gray-500 animate-pulse"></AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user?.name as string}
                  </span>
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
                  await signOut({ redirect: false });
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
