import { CompsDataTable } from "@/components/admin/competitions/CompsDataTable";
import AccountsDataTable from "@/components/admin/database/AccountsDataTable";
import SessionsDataTable from "@/components/admin/database/SessionsDataTable";
import { TeamsDataTable } from "@/components/admin/teams/TeamsDataTable";
import { UsersDataTable } from "@/components/admin/users/UsersDataTable";
import { DocumentsDataTable } from "@/components/admin/documents/DocumentsDataTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Metadata } from "next";
import { ExamDataTable } from "@/components/admin/exam/ExamDataTable";

export const metadata: Metadata = {
  title: "Database Management | Admin Panel",
  description: "Mechanical Festival 2026",
};

export default function DatabasePage() {
  return (
    <section className="min-h-screen bg-transparent w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Database Management
        </h1>
      </div>
      <Tabs defaultValue="account" className="mt-8 overflow-x-auto">
        <TabsList className="bg-white/5 border overflow-x-auto flex flex-col h-64 mx-auto sm:h-10 sm:flex-row">
          <TabsTrigger value="account" className="cursor-pointer">
            Account
          </TabsTrigger>
          <TabsTrigger value="session" className="cursor-pointer">
            Session
          </TabsTrigger>
          <TabsTrigger value="document" className="cursor-pointer">
            Documents
          </TabsTrigger>
          <TabsTrigger value="users" className="cursor-pointer">
            Users
          </TabsTrigger>
          <TabsTrigger value="teams" className="cursor-pointer">
            Teams
          </TabsTrigger>
          <TabsTrigger value="competitions" className="cursor-pointer">
            Competitions
          </TabsTrigger>
          <TabsTrigger value="exam-submission" className="cursor-pointer">
            Exam
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <div className="mt-8">
            <AccountsDataTable />
          </div>
        </TabsContent>
        <TabsContent value="session">
          <div className="mt-8">
            <SessionsDataTable />
          </div>
        </TabsContent>
        <TabsContent value="document">
          <div className="mt-8">
            <DocumentsDataTable />
          </div>
        </TabsContent>
        <TabsContent value="users">
          <div className="mt-8">
            <UsersDataTable />
          </div>
        </TabsContent>
        <TabsContent value="teams">
          <div className="mt-8">
            <TeamsDataTable />
          </div>
        </TabsContent>
        <TabsContent value="competitions">
          <div className="mt-8">
            <CompsDataTable />
          </div>
        </TabsContent>
        <TabsContent value="exam-submission">
          <div className="mt-8">
            <ExamDataTable />
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
