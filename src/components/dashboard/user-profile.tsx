import { getUserProfile } from "@/action/user.action";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { UserAvatar } from "../general/UserProfile";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";

export function UserProfile() {
  return (
    <div className="glass p-6 space-y-6">
      <div className="flex flex-col items-center">
        <Suspense
          fallback={
            <>
              <Skeleton className="h-32 w-32 rounded-full" />
              <Skeleton className="h-4 w-24 mt-4" />
              <Skeleton className="h-4 w-24 mt-2" />
            </>
          }
        >
          <FetchUserAvatar />
        </Suspense>
      </div>

      <div className="space-y-3 pt-4 border-t border-border/20">
        <Suspense
          fallback={
            <>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-24" />

              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-24" />

              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-24" />

              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-24" />

              <Skeleton className="h-4 w-full" />
            </>
          }
        >
          <FetchUserInfo />
        </Suspense>
      </div>
    </div>
  );
}

async function FetchUserAvatar() {
  const user = await getUserProfile();
  return (
    <>
      {user?.image && (
        <UserAvatar
          src={user.image as string}
          alt={user.name as string}
          className="w-32 h-32 border-2 border-primary/50"
        />
      )}
      <h2 className="mt-4 text-xl font-bold text-foreground text-center">
        {user?.name}
      </h2>
      <Link href="/dashboard/profile">
        <Badge className="mt-2 bg-primary/30 text-primary border-primary/50 hover:bg-primary/40">
          Update Profile
        </Badge>
      </Link>
    </>
  );
}

async function FetchUserInfo() {
  const user = await getUserProfile();
  return (
    <>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          Gender{" "}
        </p>
        <p className="text-sm font-medium text-foreground mt-1">
          {user?.gender ?? "Not set"}
        </p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          Institution
        </p>
        <p className="text-sm font-medium text-foreground mt-1">
          {user?.institution ?? "Not set"}
        </p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          Major
        </p>
        <p className="text-sm font-medium text-foreground mt-1">
          {user?.major ?? "Not set"}
        </p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          Current Education
        </p>
        <p className="text-sm font-medium text-foreground mt-1">
          {user?.education ?? "Not set"}
        </p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          Current Semester
        </p>
        <p className="text-sm font-medium text-foreground mt-1">
          {user?.semester ?? "Not set"}
        </p>
      </div>
    </>
  );
}
