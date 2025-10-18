import React from "react";
import CompetitionsSection from "./competitions";
import { Metadata } from "next";
import CompetitionsDesc from "./competitiondesc";

export const metadata: Metadata = {
  title: "Competitions | Mechanical Festival 2026",
  description: "Competitions of Mechanical Festival 2026",
};

function CompetitionsPage() {
  return (
    <>
      <CompetitionsSection />
      <CompetitionsDesc/>
    </>
  );
}

export default CompetitionsPage;
