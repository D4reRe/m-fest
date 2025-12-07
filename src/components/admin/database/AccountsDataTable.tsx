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
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
import { cn } from "@/lib/utils";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

export default function AccountsDataTable() {
  const trpc = useTRPC();
  // const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [filterColumn, setFilterColumn] = React.useState<string>("id");
  const {
    data: accounts,
    isLoading,
    isFetching,
  } = useQuery(trpc.admin.getAccounts.queryOptions());
  const unified = React.useMemo(() => {
    if (!accounts) return [];

    return accounts;
  }, [accounts]);

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
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      accessorFn: (row) => row.id,
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Id" />;
      },
      cell: ({ row }) => <div className="">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "accountId",
      accessorFn: (row) => row.accountId,
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Account Id" />;
      },
      cell: ({ row }) => <div className="">{row.getValue("accountId")}</div>,
    },
    {
      accessorKey: "providerId",
      accessorFn: (row) => row.providerId,
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Provider Id" />;
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("providerId")}</div>
      ),
    },
    {
      accessorKey: "userId",
      accessorFn: (row) => row.userId,
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="User Id" />;
      },
      cell: ({ row }) => <div className="">{row.getValue("userId")}</div>,
    },
    {
      accessorKey: "userName",
      accessorFn: (row) => {
        return row.user?.name ?? "";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Name" />;
      },
      cell: ({ row }) => (
        <span className="capitalize">{row.getValue("userName")}</span>
      ),
      filterFn: "includesString",
    },
    {
      accessorKey: "userEmail",
      accessorFn: (row) => {
        return row.user?.email ?? "";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Email" />;
      },
      cell: ({ row }) => (
        <span className="lowercase">{row.getValue("userEmail")}</span>
      ),
      filterFn: "includesString",
    },
    {
      accessorKey: "emailVerified",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Email Verified" />;
      },
      accessorFn: (row) => {
        return row.user?.emailVerified ? "True" : "False";
      },
      cell: ({ row }) => <span>{row.getValue("emailVerified")}</span>,
      filterFn: "includesString",
    },
    {
      accessorKey: "image",
      accessorFn: (row) => {
        return row.user?.image ?? "";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Image" />;
      },
      cell: ({ row }) => {
        const imageUrl = row.getValue("image") as string;
        return (
          <>
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
          </>
        );
      },
    },
    {
      accessorKey: "refreshToken",
      accessorFn: (row) => row.refreshToken,
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Refresh Token" />;
      },
      cell: ({ row }) => (
        <div className="">{row.getValue("refreshToken") ?? "Null"}</div>
      ),
    },
    {
      accessorKey: "idToken",
      accessorFn: (row) => row.idToken,
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Id Token" />;
      },
      cell: ({ row }) => (
        <div className="truncate w-64">{row.getValue("idToken") ?? "Null"}</div>
      ),
    },
    {
      accessorKey: "accessTokenExpiresAt",
      accessorFn: (row) => row.accessTokenExpiresAt,
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title="Access Token Expires At"
          />
        );
      },
      cell: ({ row }) => (
        <div className="">
          {row.getValue("accessTokenExpiresAt")
            ? new Date(row.getValue("accessTokenExpiresAt")).toLocaleString()
            : "Null"}
        </div>
      ),
    },
    {
      accessorKey: "refreshTokenExpiresAt",
      accessorFn: (row) => row.refreshTokenExpiresAt,
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title="Refresh Token Expires At"
          />
        );
      },
      cell: ({ row }) => (
        <div className="">
          {row.getValue("refreshTokenExpiresAt")
            ? new Date(row.getValue("refreshTokenExpiresAt")).toLocaleString()
            : "Null"}
        </div>
      ),
    },
    {
      accessorKey: "scope",
      accessorFn: (row) => row.scope,
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Scope" />;
      },
      cell: ({ row }) => (
        <div className="">{row.getValue("scope") ?? "Null"}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      accessorFn: (row) => row.createdAt,
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Created At" />;
      },
      cell: ({ row }) => (
        <div className="">
          {row.getValue("createdAt")
            ? new Date(row.getValue("createdAt")).toLocaleString()
            : "Null"}
        </div>
      ),
    },
    {
      accessorKey: "updatedAt",
      accessorFn: (row) => row.updatedAt,
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Updated At" />;
      },
      cell: ({ row }) => (
        <div className="">
          {row.getValue("updatedAt")
            ? new Date(row.getValue("updatedAt")).toLocaleString()
            : "Null"}
        </div>
      ),
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
                variant="destructive"
                className="cursor-pointer"
                onClick={() => deleteAccount.mutate({ accountId: item.id })}
              >
                Delete Account
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Link
                  href={`/admin/users/${item.userId}`}
                  target="_blank"
                  className="w-full"
                >
                  View User
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                {" "}
                <Link
                  href={`/admin/users/${item.userId}#documents`}
                  target="_blank"
                  className="w-full"
                >
                  View Documents Detail
                </Link>
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

  const deleteAccount = useMutation({
    ...trpc.admin.deleteAccount.mutationOptions(),
    onMutate: () => {
      toast.loading("Deleting account...", {
        id: "delete-account",
      });
    },

    onError: (error) => {
      toast.dismiss("delete-account");
      toast.error("Failed to delete account", {
        description: error.message,
      });
      console.log(error.message);
    },
    onSuccess() {
      toast.dismiss("delete-account");
      toast.success(`Account deleted successfully`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.admin.getAccounts.queryKey(),
      });
    },
  });

  const deleteAccountsByMany = useMutation({
    ...trpc.admin.deleteAccountsByMany.mutationOptions(),
    onMutate: () => {
      toast.loading("Deleting accounts...", {
        id: "delete-accounts",
      });
    },
    onError: (error) => {
      toast.dismiss("delete-accounts");
      toast.error("Failed to delete accounts", {
        description: error.message,
      });
      console.log(error.message);
    },
    onSuccess(data, variables) {
      toast.dismiss("delete-accounts");
      toast.success(
        `Deleted ${variables.accountIds.length} accounts successfully`,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.admin.getAccounts.queryKey(),
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
                  Id
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("accountId");
                    table.getColumn("accountId")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  Account Id
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("providerId");
                    table.getColumn("providerId")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  Provider Id
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("userId");
                    table.getColumn("userId")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  User Id
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("userName");
                    table.getColumn("userName")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  User Name
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("userEmail");
                    table.getColumn("userEmail")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  User Email
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button
            variant="outline"
            className={cn(
              "cursor-pointer w-fit",
              isFetching && "cursor-not-allowed",
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
                      },
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
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={() => {
                    const accountIds = table
                      .getFilteredSelectedRowModel()
                      .rows.map((row) => row.original.id);
                    deleteAccountsByMany.mutate({ accountIds });
                  }}
                >
                  Delete {table.getFilteredSelectedRowModel().rows.length}{" "}
                  accounts
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
                            header.getContext(),
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
                        cell.getContext(),
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
