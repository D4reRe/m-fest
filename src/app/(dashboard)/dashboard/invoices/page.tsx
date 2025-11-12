import { getUserProfile } from "@/action/user.action";
import TableInvoices from "./TableInvoices";
import { prisma } from "@/lib/prisma";
import { User } from "@/types/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoices | Mechanical Festival 2026",
  description: "Mechanical Festival 2026",
};

async function InvoicePage() {
  const user = (await getUserProfile()) as User;
  const invoices = await prisma.payment.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      team: true,
      registration: true,
      user: true,
    },
  });
  return (
    <section className="flex min-h-screen mx-auto px-4 py-4 md:py-8">
      <div className="bg-transparent h-fit w-full max-w-xs md:max-w-7xl overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]">
        <div className="bg-transparent -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
          <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
          <TableInvoices invoices={invoices} />
        </div>
      </div>
    </section>
  );
}

export default InvoicePage;
