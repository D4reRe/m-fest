"use client";

import { trpc } from "@/utils/trpc";
import {
  IconConfetti,
  IconListDetails,
  IconUsersGroup,
} from "@tabler/icons-react";
import { Users } from "lucide-react";

export default function DataOverview() {
  const { data: users } = trpc.admin.getUsers.useQuery();
  const { data: teams } = trpc.admin.getTeams.useQuery();
  const { data: registrations } = trpc.admin.getRegistrations.useQuery();
  const { data: eventRegistration } =
    trpc.admin.getEventsRegistration.useQuery();
  return (
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
  );
}
