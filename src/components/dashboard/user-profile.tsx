import { auth } from "@/auth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

export async function UserProfile() {
  const session = await auth();

  return (
    <div className="glass p-6 space-y-6">
      {/* Avatar */}
      <div className="flex flex-col items-center">
        <Avatar className="w-24 h-24 border-2 border-primary/50">
          <AvatarImage
            src={session?.user.image as string}
            alt={session?.user.name as string}
          />

          <AvatarFallback className="animate-pulse"></AvatarFallback>
        </Avatar>
        <h2 className="mt-4 text-xl font-bold text-foreground text-center">
          {session?.user.name}
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
            Institution
          </p>
          <p className="text-sm font-medium text-foreground mt-1">
            {session?.user.institution ?? "Not set"}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            Major
          </p>
          <p className="text-sm font-medium text-foreground mt-1">
            {session?.user.major ?? "Not set"}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            Current Education
          </p>
          <p className="text-sm font-medium text-foreground mt-1">
            {session?.user.education ?? "Not set"}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            Current Semester
          </p>
          <p className="text-sm font-medium text-foreground mt-1">
            {session?.user.semester ?? "Not set"}
          </p>
        </div>
      </div>
    </div>
  );
}
