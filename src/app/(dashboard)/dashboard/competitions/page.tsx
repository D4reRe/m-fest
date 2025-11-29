import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Competitions | Mechanical Festival 2026",
  description: "Mechanical Festival 2026",
};

import { RegisteredCompetitionsTeams } from "@/components/dashboard/competitions/registered-teams";
import RegisteredCompetitionList from "@/components/dashboard/competitions/RegisteredCompetitionList";

export default function CompPage() {
  return (
    <section className="min-h-screen bg-transparent w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex justify-between ">
        <h3 className="text-3xl font-bold text-foreground">
          Registered Competitions
        </h3>
      </div>
      <RegisteredCompetitionList />
      <RegisteredCompetitionsTeams />
    </section>
  );
}
