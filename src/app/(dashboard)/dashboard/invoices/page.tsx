import TableInvoices from "./TableInvoices";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoices | Mechanical Festival 2026",
  description: "Mechanical Festival 2026",
};

export default function InvoicePage() {
  return (
    <section className="flex min-h-screen bg-transparent w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-transparent h-fit w-full max-w-xs md:max-w-7xl overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]">
        <div className="bg-transparent -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
          <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
          <TableInvoices />
        </div>
      </div>
    </section>
  );
}
