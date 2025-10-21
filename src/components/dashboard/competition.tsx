"use client";

import { Trophy, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Competitions() {
  const competitions = [
    {
      id: 1,
      name: "National Coding Championship",
      rank: "12th",
      score: 8500,
      totalParticipants: 250,
      status: "Ongoing",
    },
    {
      id: 2,
      name: "Design Innovation Contest",
      rank: "5th",
      score: 9200,
      totalParticipants: 180,
      status: "Completed",
    },
    {
      id: 3,
      name: "Data Science Olympiad",
      rank: "8th",
      score: 8800,
      totalParticipants: 320,
      status: "Ongoing",
    },
  ];

  const getStatusColor = (status: string) => {
    return status === "Ongoing"
      ? "bg-accent/30 text-accent border-accent/50"
      : "bg-muted/30 text-muted-foreground border-muted/50";
  };

  return (
    <div className="glass p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">
        Competitions
      </h3>
      <div className="space-y-4">
        {competitions.map((comp) => (
          <div
            key={comp.id}
            className="glass-sm p-4 hover:bg-card/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-start gap-3 flex-1">
                <Trophy className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-foreground">{comp.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {comp.totalParticipants} participants
                  </p>
                </div>
              </div>
              <Badge className={`${getStatusColor(comp.status)} border`}>
                {comp.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/20">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">
                  Rank: {comp.rank}
                </span>
              </div>
              <span className="text-sm font-semibold text-primary">
                {comp.score} pts
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
