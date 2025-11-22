"use client";

import { useTRPC } from "@/utils/trpc";
import {
  IconConfetti,
  IconInvoice,
  IconListDetails,
  IconUsersGroup,
} from "@tabler/icons-react";
import { Users } from "lucide-react";
import { PaymentsChartLine } from "./PaymentGraph";
import { useQuery } from "@tanstack/react-query";

export default function DataOverview() {
  const trpc = useTRPC();
  const { data: users } = useQuery(trpc.admin.getUsers.queryOptions());
  const { data: teams } = useQuery(trpc.admin.getTeams.queryOptions());
  const { data: registrations } = useQuery(
    trpc.admin.getRegistrations.queryOptions()
  );
  const { data: eventRegistration } = useQuery(
    trpc.admin.getEventsRegistration.queryOptions()
  );
  const { data: invoices } = useQuery(trpc.admin.getInvoices.queryOptions());

  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="p-6 flex flex-col border rounded-lg">
          <div className="flex justify-between mb-4">
            <h1>Total Users</h1>
            <Users className="w-6 h-6" />
          </div>
          <p className="text-2xl">{users?.length}</p>
          <p className="text-muted-foreground text-sm">Signed in users</p>
        </div>
        <div className="p-6 flex flex-col border rounded-lg">
          <div className="flex justify-between mb-4">
            <h1>Total Teams</h1>
            <IconUsersGroup className="w-6 h-6" />
          </div>
          <p className="text-2xl">{teams?.length}</p>
          <p className="text-muted-foreground text-sm">Teams created</p>
        </div>
        <div className="p-6 flex flex-col border rounded-lg">
          <div className="flex justify-between mb-4">
            <h1>Total Competitions</h1>
            <IconListDetails className="w-6 h-6" />
          </div>
          <p className="text-2xl">{registrations?.length}</p>
          <p className="text-muted-foreground text-sm">Has been registered</p>
        </div>
        <div className="p-6 flex flex-col border rounded-lg">
          <div className="flex justify-between mb-4">
            <h1>Total Events</h1>
            <IconConfetti className="w-6 h-6" />
          </div>
          <p className="text-2xl">{eventRegistration?.length}</p>
          <p className="text-muted-foreground text-sm">Participated</p>
        </div>
      </div>
      <div className="w-full border rounded-lg p-6 flex justify-between mt-2">
        <div className="flex flex-col">
          <div className="flex items-center">
            <h1 className="text-2xl">Invoices</h1>
            <IconInvoice className="w-6 h-6 ml-2" />
          </div>
          <span className="text-2xl font-bold">
            {" "}
            Total Revenue : Rp.{" "}
            {invoices?.reduce((acc, invoice) => acc + invoice.amount, 0)}
          </span>
        </div>
        <div>
          <p className="text-2xl">{invoices?.length}</p>
          <p className="text-muted-foreground text-sm">
            Total payments created
          </p>
        </div>
      </div>
      <div className="mt-3">
        <PaymentsChartLine />
      </div>
    </section>
  );
}
