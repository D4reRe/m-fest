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
        name: "Alex Johnson",
        role: "Team Lead",
        avatar: "/team-member-one.png",
        status: "Active",
      },
      {
        id: 2,
        name: "Sarah Chen",
        role: "Frontend Developer",
        avatar: "/team-member-2.png",
        status: "Active",
      },
      {
        id: 3,
        name: "Marcus Williams",
        role: "Backend Developer",
        avatar: "/diverse-team-member-3.png",
        status: "Active",
      },
      {
        id: 4,
        name: "Emma Davis",
        role: "UI/UX Designer",
        avatar: "/team-member-4.jpg",
        status: "Active",
      },
      {
        id: 5,
        name: "James Rodriguez",
        role: "Data Analyst",
        avatar: "/team-member-5.jpg",
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
            <Avatar className="w-16 h-16 border-2 border-primary/50 mb-3">
              <AvatarImage
                src={member.avatar || "/placeholder.svg"}
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
