import UserDocuments from "@/components/admin/users/UserDocuments";
import { UserAvatar } from "@/components/general/UserProfile";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/server/db";
import { IconListDetails, IconUsersGroup } from "@tabler/icons-react";
import { BadgeCheckIcon, Calendar, Mail, MapPin, Phone } from "lucide-react";
import { Suspense } from "react";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "User Details | Admin Panel",
  description: "Mechanical Festival 2026",
};

export default function UserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  return (
    <main className="min-h-screen bg-transparent">
      <div className="relative z-10">
        {/* <div className="border-b border-border/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-4xl font-bold text-foreground">User Details</h1>
            <p className="text-muted-foreground mt-1">Data Overview</p>
          </div>
        </div> */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <section className="" id="user">
            <h1 className="text-4xl font-bold text-foreground">User Profile</h1>
            <p className="text-muted-foreground mt-1 mb-6">
              User&apos;s profile and verification status
            </p>
            <FetchUser params={params} />
          </section>
          <section className="mt-16" id="documents">
            <h1 className="text-4xl font-bold text-foreground">Documents</h1>
            <p className="text-muted-foreground mt-1 mb-6">
              User&apos;s documents and verification status
            </p>
            <FetchUserDocuments params={params} />
          </section>
        </div>
      </div>
    </main>
  );
}
async function FetchUser({ params }: { params: Promise<{ userId: string }> }) {
  const { userId: userIdParam } = await params;
  return (
    <div className="border p-6 rounded-lg w-full backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-1/2">
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
              <FetchUserAvatar userId={userIdParam} />
            </Suspense>
          </div>

          <div className="space-y-3 pt-4 border-t border-border/20">
            <Suspense
              fallback={
                <>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-24" />

                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-24" />

                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-24" />

                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-24" />

                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-24" />

                  <Skeleton className="h-4 w-48" />
                </>
              }
            >
              <FetchUserInfo userId={userIdParam} />
            </Suspense>
          </div>
        </div>
        <div className="w-full sm:w-1/2">
          <div className="glass p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">
              User Information
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <Suspense
                fallback={
                  <>
                    <div className="glass-sm p-4 flex items-start gap-4">
                      <Skeleton className="p-2 rounded-lg w-8 h-8"></Skeleton>
                      <div className="flex-1 min-w-0">
                        <Skeleton className="h-4 w-12 " />
                        <Skeleton className="h-4 w-32 mt-1" />
                      </div>
                    </div>
                    <div className="glass-sm p-4 flex items-start gap-4">
                      <Skeleton className="p-2 rounded-lg w-8 h-8"></Skeleton>
                      <div className="flex-1 min-w-0">
                        <Skeleton className="h-4 w-12 " />
                        <Skeleton className="h-4 w-32 mt-1" />
                      </div>
                    </div>
                    <div className="glass-sm p-4 flex items-start gap-4">
                      <Skeleton className="p-2 rounded-lg w-8 h-8"></Skeleton>
                      <div className="flex-1 min-w-0">
                        <Skeleton className="h-4 w-12 " />
                        <Skeleton className="h-4 w-32 mt-1" />
                      </div>
                    </div>
                    <div className="glass-sm p-4 flex items-start gap-4">
                      <Skeleton className="p-2 rounded-lg w-8 h-8"></Skeleton>
                      <div className="flex-1 min-w-0">
                        <Skeleton className="h-4 w-12 " />
                        <Skeleton className="h-4 w-32 mt-1" />
                      </div>
                    </div>
                    <div className="glass-sm p-4 flex items-start gap-4">
                      <Skeleton className="p-2 rounded-lg w-8 h-8"></Skeleton>
                      <div className="flex-1 min-w-0">
                        <Skeleton className="h-4 w-12 " />
                        <Skeleton className="h-4 w-32 mt-1" />
                      </div>
                    </div>
                    <div className="glass-sm p-4 flex items-start gap-4">
                      <Skeleton className="p-2 rounded-lg w-8 h-8"></Skeleton>
                      <div className="flex-1 min-w-0">
                        <Skeleton className="h-4 w-12 " />
                        <Skeleton className="h-4 w-32 mt-1" />
                      </div>
                    </div>
                  </>
                }
              >
                <FetchUserAdditionalInfo userId={userIdParam} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function FetchUserAvatar({ userId }: { userId: string }) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      documents: true,
    },
  });
  return (
    <>
      {user?.image && (
        <UserAvatar
          src={user.image as string}
          alt={user.name as string}
          className="w-32 h-32 border-2 border-primary/50"
        />
      )}
      <h2 className="mt-4 mb-1 text-xl font-bold text-foreground text-center">
        {user?.name}
      </h2>
      {
        <>
          {user?.documents?.status === "PENDING" ? (
            <Badge variant="secondary" className="bg-yellow-600 text-white">
              Pending
            </Badge>
          ) : user?.verified && user?.documents?.status === "ACCEPTED" ? (
            <Badge
              variant="secondary"
              className="bg-blue-500 text-white dark:bg-blue-600"
            >
              <BadgeCheckIcon />
              Verified
            </Badge>
          ) : (
            <Badge className="bg-red-500 text-white">Not Verified</Badge>
          )}
        </>
      }
    </>
  );
}

async function FetchUserInfo({ userId }: { userId: string }) {
  const user = await db.user.findUnique({
    where: { id: userId },
  });
  return (
    <>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          Role{" "}
        </p>
        <p className="text-sm font-medium text-foreground mt-1">
          {user?.role ?? "Not set"}
        </p>
      </div>
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

async function FetchUserAdditionalInfo({ userId }: { userId: string }) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      team_member: {
        include: {
          team: true,
        },
      },
    },
  });
  const infoItems = [
    {
      icon: IconUsersGroup,
      label: "Registered Team",
      value:
        user?.team_member[0]?.team?.teamStatus === "ACCEPTED"
          ? user?.team_member[0]?.team?.name
          : "Not a member of any registered team",
    },
    {
      icon: IconListDetails,
      label: "Competition",
      value:
        user?.team_member[0]?.team?.teamStatus === "ACCEPTED"
          ? user?.team_member[0]?.team?.competition
          : "Not a registered to any competition",
    },
    {
      icon: Mail,
      label: "Email",
      value: user?.email || "Not set",
    },
    {
      icon: Phone,
      label: "Phone",
      value: user?.phoneNumber || "Not set",
    },
    {
      icon: MapPin,
      label: "Domicile",
      value: user?.domicile || "Not set",
    },
    {
      icon: Calendar,
      label: "Birth Date",
      value: user?.birthDate
        ? new Date(user.birthDate).toDateString()
        : "Not set",
    },
  ];
  return (
    <>
      {infoItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div key={index} className="glass-sm p-4 flex items-start gap-4">
            <div className="p-2 rounded-lg bg-primary/20">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {item.label}
              </p>
              {item && (
                <p className="text-sm font-medium text-foreground mt-1 truncate">
                  {item.value}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}

async function FetchUserDocuments({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  return <UserDocuments userId={userId} />;
}
