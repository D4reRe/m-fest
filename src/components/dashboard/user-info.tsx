import { getUserProfile } from "@/action/user.action";
import { Mail, Phone, MapPin, Calendar } from "lucide-react";

export async function UserInfo() {
  const user = await getUserProfile();

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
                {item && (
                  <p className="text-sm font-medium text-foreground mt-1 truncate">
                    {item.value}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
