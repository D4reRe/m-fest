import { getUserProfile } from "@/action/user.action";
import DataOverview from "@/components/admin/data-overview/DataOverview";
import { User } from "@/types/types";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <main className="relative z-10">
        <div className="border-b border-border/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-4xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Data Overview</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <Suspense>
              <FetchDatas />
            </Suspense>
          </div>
          <DataOverview />
        </div>
      </main>
    </div>
  );
}

async function FetchDatas() {
  const user = (await getUserProfile()) as User;
  if (user?.role !== "ADMIN" && user?.role !== "SUPERADMIN") {
    redirect("/dashboard");
  }

  return <div className="hidden">AdminPage</div>;
}
