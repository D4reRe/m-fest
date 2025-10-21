"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

export function TeamMembers() {
  const team = {
    name: "Innovation Squad",
    members: [
      {
        id: 1,
        name: "Momo Ayase",
        role: "Team Lead",
        avatar: "/dashboard/Momo-Ayase.jpg",
        status: "Active",
      },
      {
        id: 2,
        name: "Aira Shiratori",
        role: "Frontend Developer",
        avatar: "/dashboard/Shiratori-Aira.jpg",
        status: "Active",
      },
      {
        id: 3,
        name: "Jiji Enjoji",
        role: "Backend Developer",
        avatar: "/dashboard/Jiji.jpg",
        status: "Active",
      },
      {
        id: 4,
        name: "Ken Takakura",
        role: "UI/UX Designer",
        avatar: "/dashboard/Okarun.jpg",
        status: "Active",
      },
      {
        id: 5,
        name: "Kinta Sakata",
        role: "Data Analyst",
        avatar: "/dashboard/Kinta.jpg",
        status: "Inactive",
      },
    ],
  };

  return (
    <div className="glass p-6">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-6 h-6 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">{team.name}</h3>
        <Badge className="bg-primary/30 text-primary border-primary/50 ml-auto">
          {team.members.length} members
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {team.members.map((member) => (
          <div
            key={member.id}
            className="glass-sm p-4 flex flex-col items-center text-center"
          >
            <Avatar className="w-24 h-24 border-2 border-primary/50 mb-3">
              <AvatarImage
                src={member.avatar || "/placeholder.svg"}
                className="object-cover object-center"
                alt={member.name}
              />
              <AvatarFallback className="bg-gradient-accent text-foreground font-bold">
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <h4 className="font-medium text-foreground text-sm">
              {member.name}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">{member.role}</p>
            <Badge
              className={`mt-3 text-xs ${
                member.status === "Active"
                  ? "bg-primary/30 text-primary border-primary/50"
                  : "bg-muted/30 text-muted-foreground border-muted/50"
              } border`}
            >
              {member.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
