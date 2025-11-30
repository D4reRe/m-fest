import { CompsDataTable } from "@/components/admin/competitions/CompsDataTable";

export default function CompetitionsManagementPage() {
  return (
    <section className="min-h-screen bg-transparent w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Competitions</h1>
      </div>
      <div className="mt-8">
        <CompsDataTable />
      </div>
    </section>
  );
}
