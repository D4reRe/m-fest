"use client";

import { Calendar, Users, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function RegisteredEvents() {
  const events = [
    {
      id: 1,
      name: "Web Development Hackathon",
      date: "March 15, 2024",
      location: "Tech Hub, Downtown",
      participants: 45,
      status: "Upcoming",
    },
    {
      id: 2,
      name: "AI & Machine Learning Workshop",
      date: "March 22, 2024",
      location: "Innovation Center",
      participants: 32,
      status: "Upcoming",
    },
    {
      id: 3,
      name: "Mobile App Development Challenge",
      date: "February 28, 2024",
      location: "Campus Hall A",
      participants: 28,
      status: "Completed",
    },
  ];

  const getStatusColor = (status: string) => {
    return status === "Upcoming"
      ? "bg-primary/30 text-primary border-primary/50"
      : "bg-muted/30 text-muted-foreground border-muted/50";
  };

  return (
    <div className="glass p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">
        Registered Events
      </h3>
      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="glass-sm p-4 hover:bg-card/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <h4 className="font-medium text-foreground flex-1">
                {event.name}
              </h4>
              <Badge className={`${getStatusColor(event.status)} border`}>
                {event.status}
              </Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{event.participants} participants</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
