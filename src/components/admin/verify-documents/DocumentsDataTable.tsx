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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";

export function DocumentsDataTable() {
  const trpc = useTRPC();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [filterColumn, setFilterColumn] = React.useState<string>("userEmail");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const queryClient = useQueryClient();
  const {
    data: datas,
    isLoading,
    isFetching,
  } = useQuery(trpc.admin.getAllDocuments.queryOptions());
  const { data: users } = useQuery(trpc.admin.getUsers.queryOptions());
  const unified = React.useMemo(() => {
    if (!datas || !users) return [];

    return datas.map((data) => ({
      ...data,
      user: users.find((user) => user.id === data.userId) ?? null,
    }));
  }, [datas, users]);

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
      accessorKey: "verifiedStatus",
      accessorFn: (row) => {
        const user = users?.find((user) => user.id === row.userId);
        return user?.verified ? "Verified" : "Not Verified";
      },
      header: ({ column }) => {
        return (
          <DataTableColumnHeader column={column} title="Verified Status" />
        );
      },
      cell: ({ getValue }) => (
        <span className="capitalize">{getValue<string>()}</span>
      ),
      filterFn: "includesString",
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader column={column} title="Document Status" />
        );
      },
      cell: ({ row }) => (
        <span className="capitalize">{row.getValue("status")}</span>
      ),
    },

    {
      accessorKey: "userId",
      accessorFn: (row) => {
        const user = users?.find((user) => user.id === row.userId);
        return user?.id ?? "";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="User Id" />;
      },
      cell: ({ row }) => (
        <span className="lowercase">{row.getValue("userId")}</span>
      ),
      filterFn: "includesString",
    },
    {
      accessorKey: "userName",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="User Name" />;
      },
      accessorFn: (row) => {
        const user = users?.find((user) => user.id === row.userId);
        return user?.name ?? "";
      },
      cell: ({ getValue }) => <span>{getValue<string>()}</span>,
      filterFn: "includesString",
    },
    {
      accessorKey: "userEmail",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="User Email" />;
      },
      accessorFn: (row) => {
        const user = users?.find((user) => user.id === row.userId);
        return user?.email ?? "";
      },
      cell: ({ getValue }) => <span>{getValue<string>()}</span>,
      filterFn: "includesString",
    },
    {
      accessorKey: "userInstitution",
      accessorFn: (row) => {
        const user = users?.find((user) => user.id === row.userId);
        return user?.institution ?? "";
      },
      header: ({ column }) => {
        return (
          <DataTableColumnHeader column={column} title="User Institution" />
        );
      },
      cell: ({ getValue }) => <span>{getValue<string>()}</span>,
      filterFn: "includesString",
    },
    {
      accessorKey: "userIdentityCard",
      header: "Identity Card",
      cell: ({ row }) => {
        const userId = row.getValue("userId") as string;
        const identityCardUrl = datas?.find(
          (user) => user.userId === userId
        )?.identityCardImageUrl;
        return (
          <Link
            href={(identityCardUrl as string) ?? ""}
            className={cn(identityCardUrl ? "underline italic font-bold" : "")}
            target="_blank"
          >
            {identityCardUrl ? "View" : "No File"}
          </Link>
        );
      },
    },
    {
      accessorKey: "userTwibbon",
      header: "Twibbon",
      cell: ({ row }) => {
        const userId = row.getValue("userId") as string;
        const twibbonUrl = datas?.find(
          (user) => user.userId === userId
        )?.twibbonImageUrl;
        return (
          <Link
            href={(twibbonUrl as string) ?? ""}
            className={cn(twibbonUrl ? "underline italic font-bold" : "")}
            target="_blank"
          >
            {twibbonUrl ? "View" : "No File"}
          </Link>
        );
      },
    },
    {
      accessorKey: "userFollowIg",
      header: "Follow IG",
      cell: ({ row }) => {
        const userId = row.getValue("userId") as string;
        const followIgUrl = datas?.find(
          (user) => user.userId === userId
        )?.followIgImageUrl;
        return (
          <Link
            href={(followIgUrl as string) ?? ""}
            className={cn(followIgUrl ? "underline italic font-bold" : "")}
            target="_blank"
          >
            {followIgUrl ? "View" : "No File"}
          </Link>
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
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(item.userId)}
              >
                Copy user ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View user</DropdownMenuItem>
              <DropdownMenuItem>View document details</DropdownMenuItem>
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
                    setFilterColumn("userId");
                    table.getColumn("userId")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  userId
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("userName");
                    table.getColumn("userName")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  userName
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("userEmail");
                    table.getColumn("userEmail")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  userEmail
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("userInstitution");
                    table.getColumn("userInstitution")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  userInstitution
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
