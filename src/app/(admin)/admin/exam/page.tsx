import { ExamDataTable } from "@/components/admin/exam/ExamDataTable";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Exam Submission | Admin Panel",
  description: "Mechanical Festival 2026",
};

export default function ExamSubmissionPage() {
  return (
    <section className="min-h-screen bg-transparent w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Exam Submission Management
        </h1>
      </div>
      <div className="mt-8">
        <ExamDataTable />
      </div>
    </section>
  );
}
