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
import { Loader2, MoreHorizontal, RefreshCw } from "lucide-react";

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
import type {
  CompetitionName,
  Prisma,
} from "../../../../prisma/generated/prisma/browser";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

type TeamMember = Prisma.TeamMemberGetPayload<{
  include: {
    user: {
      include: {
        documents: true;
      };
    };
  };
}>;

export function CompsDataTable() {
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
    data: registrations,
    isLoading,
    isFetching,
  } = useQuery(trpc.admin.getRegistrations.queryOptions());
  const unified = React.useMemo(() => {
    if (!registrations) return [];

    return registrations;
  }, [registrations]);

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
      accessorKey: "id",
      accessorFn: (row) => {
        const registration = registrations?.find(
          (regis) => regis.id === row.id
        );
        return registration?.id ?? "";
      },
      header: ({ column }) => {
        return (
          <DataTableColumnHeader column={column} title="Registration Id" />
        );
      },
      cell: ({ row }) => <span>{row.getValue("id")}</span>,
      filterFn: "includesString",
    },
    {
      accessorKey: "paymentId",
      accessorFn: (row) => {
        const registration = registrations?.find(
          (regis) => regis.id === row.id
        );
        return registration?.paymentId ?? "";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Payment Id" />;
      },
      cell: ({ row }) => <span>{row.getValue("paymentId")}</span>,
      filterFn: "includesString",
    },
    {
      accessorKey: "statusOrder",
      accessorFn: (row) => {
        const registration = registrations?.find(
          (regis) => regis.id === row.id
        );
        return registration?.statusOrder ?? "";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Status Payment" />;
      },
      cell: ({ row }) => <span>{row.getValue("statusOrder")}</span>,
      filterFn: "includesString",
    },
    {
      accessorKey: "competitionName",
      accessorFn: (row) => {
        const registration = registrations?.find(
          (regis) => regis.id === row.id
        );
        return registration?.competitionName ?? "";
      },
      header: ({ column }) => {
        return (
          <DataTableColumnHeader column={column} title="Competition Name" />
        );
      },
      cell: ({ row }) => {
        const compName = row.getValue("competitionName") as CompetitionName;
        return <span className="capitalize">{compName}</span>;
      },
      filterFn: "includesString",
    },
    {
      accessorKey: "userImage",
      accessorFn: (row) => {
        const regis = registrations?.find((regis) => regis.id === row.id);
        const data = regis?.team?.members.find(
          (member) => member.role === "Leader"
        );
        return data?.user?.image ?? "";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Leader Image" />;
      },
      cell: ({ row }) => {
        const imageUrl = row.getValue("userImage") as string;
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
        const registration = registrations?.find(
          (regis) => regis.id === row.id
        );
        return registration?.leaderUserId ?? "";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Leader User Id" />;
      },
      cell: ({ row }) => <span>{row.getValue("leaderUserId")}</span>,
      filterFn: "includesString",
    },
    {
      accessorKey: "leaderEmail",
      accessorFn: (row) => {
        const registration = registrations?.find(
          (regis) => regis.id === row.id
        );
        return registration?.leaderEmail ?? "";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Leader Email" />;
      },
      cell: ({ row }) => <span>{row.getValue("leaderEmail")}</span>,
      filterFn: "includesString",
    },
    {
      accessorKey: "leaderName",
      accessorFn: (row) => {
        const registration = registrations?.find(
          (regis) => regis.id === row.id
        );
        return registration?.leaderName ?? "";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Leader Name" />;
      },
      cell: ({ row }) => <span>{row.getValue("leaderName")}</span>,
      filterFn: "includesString",
    },
    {
      accessorKey: "leaderPhoneNumber",
      accessorFn: (row) => {
        const registration = registrations?.find(
          (regis) => regis.id === row.id
        );
        return registration?.leaderPhoneNumber ?? "";
      },
      header: ({ column }) => {
        return (
          <DataTableColumnHeader column={column} title="Leader Phone Number" />
        );
      },
      cell: ({ row }) => (
        <span className="capitalize">{row.getValue("leaderPhoneNumber")}</span>
      ),
      filterFn: "includesString",
    },

    {
      accessorKey: "teamName",
      accessorFn: (row) => {
        const registration = registrations?.find(
          (regis) => regis.id === row.id
        );
        return registration?.teamName ?? "";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Team Name" />;
      },
      cell: ({ row }) => <span className="">{row.getValue("teamName")}</span>,
      filterFn: "includesString",
    },
    {
      accessorKey: "teamInstitution",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader column={column} title="Team Institution" />
        );
      },
      accessorFn: (row) => {
        const registration = registrations?.find(
          (regis) => regis.id === row.id
        );
        return registration?.teamInstitution ?? "";
      },
      cell: ({ row }) => <span>{row.getValue("teamInstitution")}</span>,
      filterFn: "includesString",
    },
    {
      accessorKey: "teamId",
      accessorFn: (row) => {
        const registration = registrations?.find(
          (regis) => regis.id === row.id
        );
        return registration?.teamId ?? "";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Team Id" />;
      },
      cell: ({ row }) => <span>{row.getValue("teamId")}</span>,
      filterFn: "includesString",
    },
    {
      accessorKey: "teamStatus",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Team Status" />;
      },
      accessorFn: (row) => {
        const registration = registrations?.find(
          (regis) => regis.id === row.id
        );
        return registration?.teamStatus ?? "";
      },
      cell: ({ row }) => <span>{row.getValue("teamStatus")}</span>,
      filterFn: "includesString",
    },
    {
      accessorKey: "members",
      accessorFn: (row) => {
        const registration = registrations?.find(
          (regis) => regis.id === row.id
        );
        return registration?.team?.members ?? [];
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
                <DropdownMenuItem
                  key={member.userId}
                  className="cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(member.userId);
                    toast.success("User ID copied to clipboard");
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative h-10 w-10">
                      <Image
                        src={member.user?.image as string}
                        alt={member.user?.name as string}
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                    <p>{member.name}</p>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: "submissionFileUrl",
      accessorFn: (row) => {
        const registration = registrations?.find(
          (regis) => regis.id === row.id
        );
        return registration?.submissionFileUrl ?? "";
      },
      header: ({ column }) => {
        return (
          <DataTableColumnHeader column={column} title="Submission File" />
        );
      },
      cell: ({ row }) => {
        const submissionFileUrl = row.getValue("submissionFileUrl") as string;
        return (
          <>
            {submissionFileUrl ? (
              <Link
                href={(submissionFileUrl as string) ?? ""}
                className={cn(
                  submissionFileUrl ? "underline italic font-bold" : ""
                )}
                target="_blank"
              >
                {submissionFileUrl ? "View" : "No File"}
              </Link>
            ) : (
              <span>No File</span>
            )}
          </>
        );
      },
    },
    {
      accessorKey: "submissionFileUploaded",
      accessorFn: (row) => {
        const registration = registrations?.find(
          (regis) => regis.id === row.id
        );
        return registration?.submissionFileUploaded ?? false;
      },
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title="Submission File Uploaded"
          />
        );
      },
      cell: ({ row }) => {
        const submissionFileUploaded = row.getValue(
          "submissionFileUploaded"
        ) as boolean | null;
        return (
          <>{submissionFileUploaded ? <span>Yes</span> : <span>No</span>}</>
        );
      },
    },
    {
      accessorKey: "submissionFileSubmitted",
      accessorFn: (row) => {
        const registration = registrations?.find(
          (regis) => regis.id === row.id
        );
        return registration?.submissionFileSubmitted ?? false;
      },
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title="Submission File Submitted"
          />
        );
      },
      cell: ({ row }) => {
        const submissionFileSubmitted = row.getValue(
          "submissionFileSubmitted"
        ) as boolean;
        return (
          <>{submissionFileSubmitted ? <span>Yes</span> : <span>No</span>}</>
        );
      },
    },

    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(item.id)}
                className="cursor-pointer"
              >
                Copy registration ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  deleteCompRegistration.mutate({
                    compRegistrationId: item.id,
                    teamId: item.teamId as string,
                    paymentId: item.paymentId as string,
                  });
                }}
                className="cursor-pointer text-red-500"
              >
                Delete registration
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
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

  const deleteCompRegistration = useMutation({
    ...trpc.admin.deleteCompRegistration.mutationOptions(),
    onMutate: () => {
      toast.loading("Deleting registration...", {
        id: "delete-registration",
      });
    },
    onError: (error) => {
      toast.dismiss("delete-registration");
      toast.error("Failed to delete registration", {
        description: error.message,
      });
      console.log(error.message);
    },
    onSuccess() {
      toast.dismiss("delete-registration");
      toast.success(`Deleted registration successfully`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.admin.getRegistrations.queryKey(),
      });
    },
  });
  const deleteCompRegistrationByMany = useMutation({
    ...trpc.admin.deleteCompRegistrationByMany.mutationOptions(),
    onMutate: () => {
      toast.loading("Deleting registrations...", {
        id: "delete-registrations",
      });
    },
    onError: (error) => {
      toast.dismiss("delete-registrations");
      toast.error("Failed to delete registrations", {
        description: error.message,
      });
      console.log(error.message);
    },
    onSuccess(data, variables) {
      toast.dismiss("delete-registrations");
      toast.success(
        `Deleted ${variables.compRegistrationIds.length} registrations successfully`
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.admin.getRegistrations.queryKey(),
      });
      table.resetRowSelection();
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <div className="flex gap-2">
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
                  Registration ID
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("competitionName");
                    table.getColumn("competitionName")?.setFilterValue("");
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
                  Payment ID
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
                    setFilterColumn("teamName");
                    table.getColumn("teamName")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  Team Name
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
                    setFilterColumn("teamId");
                    table.getColumn("teamId")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  Team Id
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("statusOrder");
                    table.getColumn("statusOrder")?.setFilterValue("");
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
                      .rows.map((row) => row.original.teamId);
                    const compRegistrationIds = table
                      .getFilteredSelectedRowModel()
                      .rows.map((row) => row.original.id);
                    const paymentIds = table
                      .getFilteredSelectedRowModel()
                      .rows.map((row) => row.original.paymentId);
                    deleteCompRegistrationByMany.mutate({
                      teamIds: teamIds as string[],
                      compRegistrationIds,
                      paymentIds: paymentIds as string[],
                    });
                  }}
                  className="cursor-pointer text-red-500"
                >
                  Delete {table.getFilteredSelectedRowModel().rows.length}{" "}
                  registrations
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
        <DataTableViewOptions table={table} />
      </div>
      <div className="overflow-hidden rounded-md border mb-2">
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
