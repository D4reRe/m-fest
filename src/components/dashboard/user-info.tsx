"use client";
import { Skeleton } from "@heroui/react";
import { Mail, Phone, MapPin, Calendar } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function UserInfo() {
  const { data: session, status } = useSession();
  const [birthDate, setBirthDate] = useState<string | null>("");

  useEffect(() => {
    if (session?.user?.birthDate) {
      const date = new Date(session.user.birthDate);
      setBirthDate(
        date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    }
  }, [session]);

  const infoItems = [
    {
      icon: Mail,
      label: "Email",
      value: session?.user.email || "Not set",
    },
    {
      icon: Phone,
      label: "Phone",
      value: session?.user.phoneNumber || "Not set",
    },
    {
      icon: MapPin,
      label: "Domicile",
      value: session?.user.domicile || "Not set",
    },
    {
      icon: Calendar,
      label: "Birth Date",
      value: birthDate || "Not set",
    },
  ];

  return (
    <div className="glass p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">
        Personal Information
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                {status === "authenticated" && (
                  <p className="text-sm font-medium text-foreground mt-1 truncate">
                    {item.value}
                  </p>
                )}
                {status === "loading" && (
                  <Skeleton className="h-4 w-24 rounded-lg"></Skeleton>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
