"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  // DropdownMenuSeparator,
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
import { Verification } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export function DocumentsDataTable() {
  const trpc = useTRPC();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const { data } = useQuery(trpc.admin.getAllVerification.queryOptions());
  const { data: users } = useQuery(trpc.admin.getUsers.queryOptions());
  const { data: teamMembers } = useQuery(
    trpc.admin.getAllTeamMembers.queryOptions()
  );

  const columns: ColumnDef<Verification>[] = [
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
      header: "Verified Status",
      cell: ({ row }) => {
        const userId = row.getValue("userId") as string;
        const user = users?.find((user) => user.id === userId);

        return (
          <span className="capitalize">
            {user?.verified ? "Verified" : "Not Verified"}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Document Status",
      cell: ({ row }) => (
        <span className="capitalize">{row.getValue("status")}</span>
      ),
    },

    {
      accessorKey: "userId",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User Id <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="lowercase">{row.getValue("userId")}</span>
      ),
    },
    {
      accessorKey: "userName",
      header: "User Name",
      cell: ({ row }) => {
        const userId = row.getValue("userId") as string;
        const user = users?.find((user) => user.id === userId);
        return <span>{user?.name}</span>;
      },
    },
    {
      accessorKey: "userEmail",
      header: "User Email",
      cell: ({ row }) => {
        const userId = row.getValue("userId") as string;
        const user = users?.find((user) => user.id === userId);
        return <span>{user?.email}</span>;
      },
    },
    {
      accessorKey: "userInstitution",
      header: "User Institution",
      cell: ({ row }) => {
        const userId = row.getValue("userId") as string;
        const user = users?.find((user) => user.id === userId);
        return <span>{user?.institution}</span>;
      },
    },
    {
      accessorKey: "userIdentityCard",
      header: "Identity Card",
      cell: ({ row }) => {
        const userId = row.getValue("userId") as string;
        const identityCardUrl = data?.find(
          (user) => user.userId === userId
        )?.identityCardImageUrl;
        return (
          <Link
            href={identityCardUrl as string}
            className="underline italic"
            target="_blank"
          >
            Identity Card
          </Link>
        );
      },
    },
    {
      accessorKey: "userTwibbon",
      header: "Twibbon",
      cell: ({ row }) => {
        const userId = row.getValue("userId") as string;
        const twibbonUrl = data?.find(
          (user) => user.userId === userId
        )?.twibbonImageUrl;
        return (
          <Link
            href={twibbonUrl as string}
            className="underline italic"
            target="_blank"
          >
            Twibbon
          </Link>
        );
      },
    },
    {
      accessorKey: "userFollowIg",
      header: "Follow IG",
      cell: ({ row }) => {
        const userId = row.getValue("userId") as string;
        const followIgUrl = data?.find(
          (user) => user.userId === userId
        )?.followIgImageUrl;
        return (
          <Link
            href={followIgUrl as string}
            className="underline italic"
            target="_blank"
          >
            Follow IG
          </Link>
        );
      },
    },
    // {
    //   accessorKey: "createdAt",
    //   header: "Created",
    //   cell: ({ row }) => {
    //     const date = row.getValue("createdAt") as Date;
    //     return <span>{new Date(date).toLocaleString()}</span>;
    //   },
    // },

    // {
    //   accessorKey: "updatedAt",
    //   header: "Updated",
    //   cell: ({ row }) => {
    //     const date = row.getValue("updatedAt") as Date;
    //     return <span>{new Date(date).toLocaleString()}</span>;
    //   },
    // },

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
                onClick={() => navigator.clipboard.writeText(item.id)}
              >
                Copy payment ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data ?? [],
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
        <Input
          placeholder="Filter emails..."
          value={
            (table.getColumn("userEmail")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("userEmail")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
