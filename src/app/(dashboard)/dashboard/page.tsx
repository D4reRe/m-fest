import { getUserProfile } from "@/action/user.action";
import { Competitions } from "@/components/dashboard/competition";
import { Events } from "@/components/dashboard/events";
import { TeamMembers } from "@/components/dashboard/team-member";
import { UserInfo } from "@/components/dashboard/user-info";
import { UserProfile } from "@/components/dashboard/user-profile";
import { User } from "@/types/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Mechanical Festival 2026",
  description: "Mechanical Festival 2026",
};

async function DashboardHomePage() {
  const user = (await getUserProfile()) as User;
  return (
    <div className="min-h-screen bg-transparent">
      <main className="relative z-10">
        {/* Header */}
        <div className="border-b border-border/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">General Overview</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="min-h-screen bg-transparent w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-8">
            {/* Profile Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <UserProfile user={user} />
              </div>
              <div className="lg:col-span-2">
                <UserInfo user={user} />
              </div>
            </div>

            {/* Events and Competitions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Events />
              <Competitions />
            </div>

            {/* Team Members */}
            <TeamMembers user={user} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardHomePage;
