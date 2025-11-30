"use client";
import Link from "next/link";
import { Loader2, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { UserAvatar } from "./UserProfile";
import { menuItems } from "@/constants/constants";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";
import { authClient } from "@/lib/auth-client";

export const Navbar = () => {
  const [menuState, setMenuState] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const currentPath = usePathname();
  const { data: session, isPending } = authClient.useSession();

  const trpc = useTRPC();
  const {
    data,
    isLoading: isLoadingUser,
    isFetched,
  } = useQuery({
    ...trpc.dashboard.getUser.queryOptions(),
    enabled: session?.user ? true : false,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className="fixed z-20 w-full px-2"
      >
        <div
          className={cn(
            "mx-auto w-full px-6 transition-all duration-300 lg:px-12 bg-background/50 backdrop-blur-lg",
            isScrolled && "mt-2 max-w-6xl rounded-2xl border lg:px-5"
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
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
                  loading="lazy"
                />
                <Image
                  src="/hmm.png"
                  alt="HMM ITB"
                  width={45}
                  height={45}
                  loading="lazy"
                />
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className={cn(
                        currentPath === item.href
                          ? "text-accent-foreground"
                          : "text-muted-foreground hover:text-accent-foreground"
                      )}
                      prefetch
                    >
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
                {isFetched && session?.user && (
                  <li>
                    <Link
                      href="/dashboard"
                      className={cn(
                        currentPath === "/dashboard"
                          ? "text-accent-foreground"
                          : "text-muted-foreground hover:text-accent-foreground"
                      )}
                      prefetch
                    >
                      <span>Dashboard</span>
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150"
                        prefetch
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                  {isFetched && session?.user && (
                    <li>
                      <Link
                        href="/dashboard"
                        className={cn(
                          currentPath === "/dashboard"
                            ? "text-accent-foreground"
                            : "text-muted-foreground hover:text-accent-foreground"
                        )}
                        prefetch
                      >
                        <span>Dashboard</span>
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                {isPending && (
                  <div className="flex items-center gap-2 animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-gray-300" />
                    <div className="w-20 h-4 bg-gray-300 rounded" />
                  </div>
                )}
                {isFetched && session?.user && (
                  <div className="flex gap-5 items-center">
                    {data?.image ? (
                      <UserAvatar
                        src={data?.image as string}
                        alt={data?.name as string}
                        className="w-15 h-15 border-2 border-primary/50"
                      />
                    ) : (
                      <div className="flex items-center gap-2 animate-pulse">
                        <div className="w-8 h-8 rounded-full bg-gray-300" />
                        <div className="w-20 h-4 bg-gray-300 rounded" />
                      </div>
                    )}
                    <p className={cn(isScrolled ? "lg:hidden" : "text-sm")}>
                      {data?.name}
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      className={`${
                        isLoading ? "cursor-not-allowed" : "cursor-pointer"
                      }`}
                      disabled={isLoading}
                      type="button"
                      onClick={async () => {
                        setIsLoading(true);
                        toast.loading("Logging out...", {
                          id: "logging-out",
                        });
                        try {
                          await authClient.signOut();
                          toast.success("Logged out successfully");
                          toast.dismiss("logging-out");
                          router.refresh();
                          router.replace("/login");
                        } catch (error) {
                          toast.error("Failed to log out");
                          console.error(error);
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                    >
                      {isLoading ? (
                        <div className="flex gap-2">
                          <span>Logging out...</span>
                          <Loader2 className="animate-spin" />
                        </div>
                      ) : (
                        "Log Out"
                      )}
                    </Button>
                  </div>
                )}
                {!session?.user && !isPending && (
                  <>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className={cn(isScrolled && "lg:hidden")}
                    >
                      <Link href="/login">
                        <span>Login</span>
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className={cn(isScrolled ? "lg:inline-flex" : "hidden")}
                    >
                      <Link href="/login">
                        <span>Login</span>
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
