import { UsersDataTable } from "@/components/admin/users/UsersDataTable";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users Management | Admin Panel",
  description: "Mechanical Festival 2026",
};

export default function UserManagementPage() {
  return (
    <section className="min-h-screen bg-transparent w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Users</h1>
      </div>
      <div className="mt-8">
        <UsersDataTable />
      </div>
    </section>
  );
}
