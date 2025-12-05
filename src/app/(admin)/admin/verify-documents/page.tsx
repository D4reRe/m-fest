import { DocumentsDataTable } from "@/components/admin/verify-documents/DocumentsDataTable";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Documents | Admin Panel",
  description: "Mechanical Festival 2026",
};

export default function VerifyDocumentsPage() {
  return (
    <section className="min-h-screen bg-transparent w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Verify Documents</h1>
      </div>
      <div className="mt-8">
        <DocumentsDataTable />
      </div>
    </section>
  );
}
