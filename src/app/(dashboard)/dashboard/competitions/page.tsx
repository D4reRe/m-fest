import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Competitions | Mechanical Festival 2026",
  description: "Mechanical Festival 2026",
};

import { RegisteredCompetitions } from "@/components/dashboard/competitions/registered-teams";
import { RegisteredStemCompetition } from "@/components/dashboard/competitions/registered-stem";
import CompetitionListDashboard from "@/components/dashboard/competitions/CompetitionListDashboard";

export default function CompPage() {
  return (
    <section className="min-h-screen bg-transparent max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex justify-between ">
        <h3 className="text-3xl font-bold text-foreground">Competitions</h3>
      </div>
      <CompetitionListDashboard />
      <RegisteredCompetitions />
      <RegisteredStemCompetition />
    </section>
  );
}
