import { auth } from "@/auth";
import { Competitions } from "@/components/dashboard/competition";
import { Events } from "@/components/dashboard/events";
import { TeamMembers } from "@/components/dashboard/team-member";
import { UserInfo } from "@/components/dashboard/user-info";
import { UserProfile } from "@/components/dashboard/user-profile";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Dashboard | Mechanical Festival 2026",
  description: "Mechanical Festival 2026",
};

async function DashboardHomePage() {
  const session = await auth();
  if (!session) redirect("/login");
  return (
    <div className="min-h-screen bg-transparent">
      {/* Background gradient effect */}

      <main className="relative z-10">
        {/* Header */}
        <div className="border-b border-border/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">General Overview</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Profile Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <UserProfile />
              </div>
              <div className="lg:col-span-2">
                <UserInfo />
              </div>
            </div>

            {/* Events and Competitions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Events />
              <Competitions />
            </div>

            {/* Team Members */}
            <TeamMembers />
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardHomePage;
