import { Mail, Phone, MapPin, Calendar } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
import { User } from "@/types/types";

export function UserInfo({ user }: { user: User }) {
  return (
    <div className="glass p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">
        Personal Information
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
            </>
          }
        >
          <FetchUserInfo user={user} />
        </Suspense>
      </div>
    </div>
  );
}

async function FetchUserInfo({ user }: { user: User }) {
  const infoItems = [
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
      value: user?.birthDate || "Not set",
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
