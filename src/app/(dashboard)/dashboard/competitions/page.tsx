import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Competitions | Mechanical Festival 2026",
  description: "Mechanical Festival 2026",
};
import { RegisteredCompetitions } from "@/components/dashboard/registered-teams";
import { RegisteredStemCompetition } from "@/components/dashboard/registered-stem";

export default function CompPage() {
  return (
    <section className="min-h-screen bg-transparent">
      <div className="flex justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h3 className="text-3xl font-bold text-foreground">
          Registered Competitions
        </h3>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RegisteredCompetitions />
      </div>
      <RegisteredStemCompetition />
    </section>
  );
}
