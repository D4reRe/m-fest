"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  ArrowUpRightSquare,
  BadgeCheckIcon,
  Loader2,
  MoreHorizontal,
  RefreshCw,
  ViewIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTRPC } from "@/utils/trpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
import { toast } from "sonner";
import type { Prisma } from "../../../../prisma/generated/prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type TeamMember = Prisma.TeamMemberGetPayload<{
  include: {
    user: {
      include: {
        documents: true;
      };
    };
  };
}>;

export function TeamsDataTable() {
  const trpc = useTRPC();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [filterColumn, setFilterColumn] = React.useState<string>("id");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const queryClient = useQueryClient();
  const {
    data: teams,
    isLoading,
    isFetching,
  } = useQuery(trpc.admin.getTeams.queryOptions());
  const unified = React.useMemo(() => {
    if (!teams) return [];

    return teams;
  }, [teams]);

  // type of array
  // type Unified = typeof unified

  // type of one array element
  type Unified = (typeof unified)[number];

  const columns: ColumnDef<Unified>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                Actions for <span className="font-bold">{item.name}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => approveTeam.mutate({ teamId: item.id })}
                className="cursor-pointer text-green-500 hover:text-green-500! hover:bg-green-900/60!"
              >
                Approve team
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => rejectTeam.mutate({ teamId: item.id })}
                className="cursor-pointer text-yellow-500 hover:text-yellow-500! hover:bg-yellow-900/80!"
              >
                Reject team
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  deleteTeam.mutate({
                    teamId: item.id,
                    paymentId: item.paymentId,
                  })
                }
                className="cursor-pointer"
                variant="destructive"
              >
                Delete Team
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(item.id);
                  toast.success("Team ID copied to clipboard");
                }}
                className="cursor-pointer"
              >
                Copy team ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(item.leaderUserId as string);
                  toast.success("Leader User ID copied to clipboard");
                }}
                className="cursor-pointer"
              >
                Copy leader&apos;s user Id
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(item.leaderEmail as string);
                  toast.success("Leader email copied to clipboard");
                }}
                className="cursor-pointer"
              >
                Copy leader&apos;s email
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(
                    item.leaderPhoneNumber as string
                  );
                  toast.success("Leader phone number copied to clipboard");
                }}
                className="cursor-pointer"
              >
                Copy leader&apos;s phone number
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: "id",
      accessorFn: (row) => {
        const team = teams?.find((team) => team.id === row.id);
        return team?.id ?? "";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Team Id" />;
      },
      cell: ({ row }) => <span>{row.getValue("id")}</span>,
      filterFn: "includesString",
    },
    {
      accessorKey: "paymentId",
      accessorFn: (row) => {
        const team = teams?.find((team) => team.id === row.id);
        return team?.paymentId ?? "Not paid yet";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Payment Id" />;
      },
      cell: ({ row }) => <span>{row.getValue("paymentId")}</span>,
      filterFn: "includesString",
    },
    {
      accessorKey: "status",
      accessorFn: (row) => {
        const team = teams?.find((team) => team.id === row.id);
        return team?.status ?? "Not set";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Status Payment" />;
      },
      cell: ({ row }) => (
        <span>
          {" "}
          {row.getValue("status") === "PENDING" ? (
            <Badge variant="secondary" className="bg-yellow-600 text-white">
              Pending
            </Badge>
          ) : row.getValue("status") === "SUCCESS" ? (
            <Badge
              variant="secondary"
              className="bg-green-500 text-white dark:bg-green-600"
            >
              <BadgeCheckIcon />
              Success
            </Badge>
          ) : (
            <Badge className="bg-red-500 text-white">No Payment Made</Badge>
          )}
        </span>
      ),
      filterFn: "includesString",
    },
    {
      accessorKey: "teamStatus",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Team Status" />;
      },
      accessorFn: (row) => {
        const team = teams?.find((team) => team.id === row.id);
        return team?.teamStatus ?? "Not set";
      },
      cell: ({ row }) => (
        <span>
          {row.getValue("teamStatus") === "PENDING" ? (
            <Badge variant="secondary" className="bg-yellow-600 text-white">
              Pending
            </Badge>
          ) : row.getValue("teamStatus") === "ACCEPTED" ? (
            <Badge
              variant="secondary"
              className="bg-blue-500 text-white dark:bg-blue-600"
            >
              <BadgeCheckIcon />
              Verified
            </Badge>
          ) : (
            <Badge className="bg-red-500 text-white">Not Verified</Badge>
          )}
        </span>
      ),
      filterFn: "includesString",
    },
    {
      accessorKey: "name",
      accessorFn: (row) => {
        const team = teams?.find((team) => team.id === row.id);
        return team?.name ?? "";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Team Name" />;
      },
      cell: ({ row }) => <span>{row.getValue("name")}</span>,
      filterFn: "includesString",
    },
    {
      accessorKey: "members",
      accessorFn: (row) => {
        const team = teams?.find((team) => team.id === row.id);
        return team?.members ?? [];
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Members" />;
      },
      cell: ({ row }) => {
        const members = row.getValue("members") as TeamMember[];
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-fit h-fit border">
                <span className="italic underline font-bold cursor-pointer">
                  Members
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Members</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {members.map((member) => (
                <DropdownMenuItem key={member.userId}>
                  <Link
                    href={`/admin/users/${member.userId}`}
                    className="cursor-pointer"
                    target="_blank"
                  >
                    <div className="flex items-center justify-center gap-4">
                      <div className="relative h-10 w-10">
                        <Image
                          src={member.user?.image as string}
                          alt={member.user?.name as string}
                          fill
                          className="object-cover rounded-full"
                        />
                      </div>
                      <p>{member.user?.name}</p>
                      {member.role === "Leader" ? (
                        <Badge variant={"default"} className="-ml-2">
                          {member.role}
                        </Badge>
                      ) : (
                        <Badge
                          variant={"outline"}
                          className="-ml-2 bg-white/50"
                        >
                          {member.role}
                        </Badge>
                      )}
                      <ArrowUpRightSquare className="w-4 h-4 text-gray-500" />
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: "competition",
      accessorFn: (row) => {
        const team = teams?.find((team) => team.id === row.id);
        return team?.competition ?? "Not registered to any competition";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Competition" />;
      },
      cell: ({ row }) => (
        <span className="capitalize">{row.getValue("competition")}</span>
      ),
      filterFn: "includesString",
    },

    {
      accessorKey: "leaderImage",
      accessorFn: (row) => {
        const team = teams?.find((team) => team.id === row.id);
        const data = team?.members.find((member) => member.role === "Leader");
        return data?.user?.image ?? "";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Leader Image" />;
      },
      cell: ({ row }) => {
        const imageUrl = row.getValue("leaderImage") as string;
        return (
          <div className="flex justify-center">
            {imageUrl ? (
              <Link href={imageUrl} target="_blank">
                <div className="w-10 h-10 relative">
                  <Image
                    src={imageUrl}
                    alt="User's Image"
                    fill
                    className=" object-cover rounded-full "
                  />
                </div>
              </Link>
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "leaderUserId",
      accessorFn: (row) => {
        const team = teams?.find((team) => team.id === row.id);
        return team?.leaderUserId ?? "";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Leader User Id" />;
      },
      cell: ({ row }) => (
        <span className="capitalize">{row.getValue("leaderUserId")}</span>
      ),
      filterFn: "includesString",
    },
    {
      accessorKey: "leaderName",
      accessorFn: (row) => {
        const team = teams?.find((team) => team.id === row.id);
        return team?.leaderName ?? "";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Leader Name" />;
      },
      cell: ({ row }) => <span className="">{row.getValue("leaderName")}</span>,
      filterFn: "includesString",
    },
    {
      accessorKey: "leaderEmail",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Leader Email" />;
      },
      accessorFn: (row) => {
        const team = teams?.find((team) => team.id === row.id);
        return team?.leaderEmail ?? "";
      },
      cell: ({ row }) => <span>{row.getValue("leaderEmail")}</span>,
      filterFn: "includesString",
    },
    {
      accessorKey: "leaderPhoneNumber",
      accessorFn: (row) => {
        const team = teams?.find((team) => team.id === row.id);
        return team?.leaderPhoneNumber ?? "";
      },
      header: ({ column }) => {
        return (
          <DataTableColumnHeader column={column} title="Leader Phone Number" />
        );
      },
      cell: ({ row }) => {
        const phoneNumber = row.getValue("leaderPhoneNumber") as string;
        return <span className="lowercase">{phoneNumber}</span>;
      },
      filterFn: "includesString",
    },
    {
      accessorKey: "teamInstitution",
      accessorFn: (row) => {
        const team = teams?.find((team) => team.id === row.id);
        return team?.teamInstitution ?? "Not set";
      },
      header: ({ column }) => {
        return (
          <DataTableColumnHeader column={column} title="Team Institution" />
        );
      },
      cell: ({ row }) => <span>{row.getValue("teamInstitution")}</span>,
      filterFn: "includesString",
    },
    {
      accessorKey: "verificationDeadlineAt",
      accessorFn: (row) => {
        const team = teams?.find((team) => team.id === row.id);
        return team?.verificationDeadlineAt
          ? new Date(team.verificationDeadlineAt).toLocaleString()
          : "Not set";
      },
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title="Verification Deadline"
          />
        );
      },
      cell: ({ row }) => <span>{row.getValue("verificationDeadlineAt")}</span>,
      filterFn: "includesString",
    },
    {
      accessorKey: "createdAt",
      accessorFn: (row) => {
        const team = teams?.find((team) => team.id === row.id);
        return team?.createdAt
          ? new Date(team.createdAt).toLocaleString()
          : "Not set";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Created At" />;
      },
      cell: ({ row }) => <span>{row.getValue("createdAt")}</span>,
      filterFn: "includesString",
    },
  ];

  const table = useReactTable({
    data: unified ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const approveTeam = useMutation({
    ...trpc.admin.approveTeam.mutationOptions(),
    onMutate: () => {
      toast.loading("Updating team...", {
        id: "update-team",
      });
    },

    onError: (error) => {
      toast.dismiss("update-team");
      toast.error("Failed to verify team", {
        description: error.message,
      });
      console.log(error.message);
    },
    onSuccess(data, variables) {
      toast.dismiss("update-team");
      toast.success(
        `Team ${
          teams?.find((team) => team.id === variables.teamId)?.name
        } verified successfully`
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.admin.getTeams.queryKey(),
      });
    },
  });
  const rejectTeam = useMutation({
    ...trpc.admin.rejectTeam.mutationOptions(),
    onMutate: () => {
      toast.loading("Updating team...", {
        id: "update-team",
      });
    },

    onError: (error) => {
      toast.dismiss("update-team");
      toast.error("Failed to unverify team", {
        description: error.message,
      });
      console.log(error.message);
    },
    onSuccess(data, variables) {
      toast.dismiss("update-team");
      toast.success(
        `Team ${
          teams?.find((team) => team.id === variables.teamId)?.name
        } unverified successfully`
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.admin.getTeams.queryKey(),
      });
    },
  });
  const deleteTeam = useMutation({
    ...trpc.admin.deleteTeam.mutationOptions(),
    onMutate: () => {
      toast.loading("Deleting team...", {
        id: "delete-team",
      });
    },

    onError: (error) => {
      toast.dismiss("delete-team");
      toast.error("Failed to delete team", {
        description: error.message,
      });
      console.log(error.message);
    },
    onSuccess(data, variables) {
      toast.dismiss("delete-team");
      toast.success(
        `Team ${
          teams?.find((team) => team.id === variables.teamId)?.name
        } deleted successfully`
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.admin.getTeams.queryKey(),
      });
    },
  });
  const approveTeamsByMany = useMutation({
    ...trpc.admin.approveTeamsByMany.mutationOptions(),
    onMutate: () => {
      toast.loading("Updating teams...", {
        id: "update-team",
      });
    },

    onError: (error) => {
      toast.dismiss("update-team");
      toast.error("Failed to verify teams", {
        description: error.message,
      });
      console.log(error.message);
    },
    onSuccess(data, variables) {
      toast.dismiss("update-team");
      toast.success(
        `Teams verified successfully for ${variables.teamIds.length} teams`
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.admin.getTeams.queryKey(),
      });
      table.resetRowSelection();
    },
  });
  const rejectTeamsByMany = useMutation({
    ...trpc.admin.rejectTeamsByMany.mutationOptions(),
    onMutate: () => {
      toast.loading("Updating teams...", {
        id: "update-team",
      });
    },

    onError: (error) => {
      toast.dismiss("update-team");
      toast.error("Failed to unverify teams", {
        description: error.message,
      });
      console.log(error.message);
    },
    onSuccess(data, variables) {
      toast.dismiss("update-team");
      toast.success(
        `Teams unverifed successfully for ${variables.teamIds.length} teams`
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.admin.getTeams.queryKey(),
      });
      table.resetRowSelection();
    },
  });
  const deleteTeamByMany = useMutation({
    ...trpc.admin.deleteTeamByMany.mutationOptions(),
    onMutate: () => {
      toast.loading("Deleting teams...", {
        id: "delete-team",
      });
    },

    onError: (error) => {
      toast.dismiss("delete-team");
      toast.error("Failed to delete teams", {
        description: error.message,
      });
      console.log(error.message);
    },
    onSuccess(data, variables) {
      toast.dismiss("delete-team");
      toast.success(
        `Teams deleted successfully for ${variables.teamIds.length} teams`
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.admin.getTeams.queryKey(),
      });
      table.resetRowSelection();
    },
  });

  return (
    <div className="w-full">
      <div className="flex flex-wrap sm:flex-nowrap gap-3 items-center py-4">
        <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full md:w-auto">
          <Input
            placeholder="Filter..."
            value={
              (table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(filterColumn)?.setFilterValue(event.target.value)
            }
            className="max-w-sm w-full"
          />
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-fit cursor-pointer">
                  <span className="">Filter by column:</span>
                  <span className="capitalize">{filterColumn}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("id");
                    table.getColumn("id")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  Team Id
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("name");
                    table.getColumn("name")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  Team Name
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("competition");
                    table.getColumn("competition")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  Competition
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("paymentId");
                    table.getColumn("paymentId")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  Payment Id
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("leaderUserId");
                    table.getColumn("leaderUserId")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  LeaderUserId
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("leaderName");
                    table.getColumn("leaderName")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  Leader Name
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("leaderEmail");
                    table.getColumn("leaderEmail")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  Leader Email
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("leaderPhoneNumber");
                    table.getColumn("leaderPhoneNumber")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  Leader Phone Number
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("teamInstitution");
                    table.getColumn("teamInstitution")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  Team Institution
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("status");
                    table.getColumn("status")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  Status Payment
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("teamStatus");
                    table.getColumn("teamStatus")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  Team Status
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("createdAt");
                    table.getColumn("createdAt")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  Created at
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button
            variant="outline"
            className={cn(
              "cursor-pointer w-fit",
              isFetching && "cursor-not-allowed"
            )}
            disabled={isFetching}
            onClick={() => queryClient.invalidateQueries()}
          >
            <RefreshCw
              className={cn("w-4 h-4", {
                "animate-spin": isFetching,
              })}
            />
          </Button>
          {table.getFilteredSelectedRowModel().rows.length ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="relative cursor-pointer"
                  disabled={isFetching}
                >
                  <div
                    className={cn(
                      "absolute -top-1 -right-1 w-4 h-4 border rounded-full bg-white text-black flex justify-center items-center",
                      {
                        "w-6":
                          table.getFilteredSelectedRowModel().rows.length > 9,
                        "w-7":
                          table.getFilteredSelectedRowModel().rows.length > 99,
                      }
                    )}
                  >
                    <p>{table.getFilteredSelectedRowModel().rows.length}</p>
                  </div>
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    const teamIds = table
                      .getFilteredSelectedRowModel()
                      .rows.map((row) => row.original.id);
                    approveTeamsByMany.mutate({ teamIds });
                  }}
                  className="cursor-pointer text-green-500 hover:text-green-500! hover:bg-green-900/60!"
                >
                  Approve {table.getFilteredSelectedRowModel().rows.length}{" "}
                  teams
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    const teamIds = table
                      .getFilteredSelectedRowModel()
                      .rows.map((row) => row.original.id);
                    rejectTeamsByMany.mutate({ teamIds });
                  }}
                  className="cursor-pointer text-yellow-500 hover:text-yellow-500! hover:bg-yellow-900/80!"
                >
                  Reject {table.getFilteredSelectedRowModel().rows.length} teams
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    const teamIds = table
                      .getFilteredSelectedRowModel()
                      .rows.map((row) => row.original.id);
                    const paymentIds = table
                      .getFilteredSelectedRowModel()
                      .rows.map((row) => row.original.paymentId);
                    deleteTeamByMany.mutate({
                      teamIds,
                      paymentIds,
                    });
                  }}
                  className="cursor-pointer"
                  variant="destructive"
                >
                  Delete {table.getFilteredSelectedRowModel().rows.length} teams
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
        <DataTableViewOptions table={table} />
      </div>
      <div className="overflow-x-auto rounded-md border mb-2">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <span className="flex justify-center items-center">
                    <Loader2 className="animate-spin w-6 h-6" />
                  </span>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
