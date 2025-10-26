import { getUserProfile } from "@/action/user.action";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { UserAvatar } from "../general/UserProfile";

export async function UserProfile() {
  const user = await getUserProfile();
  return (
    <div className="glass p-6 space-y-6">
      <div className="flex flex-col items-center">
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
      </div>

      {/* Quick Info */}
      <div className="space-y-3 pt-4 border-t border-border/20">
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
      </div>
    </div>
  );
}
