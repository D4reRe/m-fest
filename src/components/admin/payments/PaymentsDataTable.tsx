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
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
import Image from "next/image";
import { toast } from "sonner";

export function PaymentsDataTable() {
  const trpc = useTRPC();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [filterColumn, setFilterColumn] = React.useState<string>("id");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const queryClient = useQueryClient();
  const {
    data: payments,
    isLoading,
    isFetching,
  } = useQuery(trpc.admin.getInvoices.queryOptions());
  const unified = React.useMemo(() => {
    if (!payments) return [];

    return payments;
  }, [payments]);

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
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                variant="destructive"
                onClick={() => {
                  deleteInvoice.mutate({
                    invoiceId: item.id,
                    orderId: item.orderId,
                  });
                }}
              >
                Delete invoice
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(item.id)}
              >
                Copy payment ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: "id",
      accessorFn: (row) => {
        return row.id;
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Payment ID" />;
      },
      cell: ({ row }) => <span>{row.getValue("id")}</span>,
    },
    {
      accessorKey: "orderId",
      accessorFn: (row) => {
        return row.orderId;
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Order ID" />;
      },
      cell: ({ row }) => (
        <span className="capitalize">{row.getValue("orderId")}</span>
      ),
      filterFn: "includesString",
    },
    {
      accessorKey: "userId",
      accessorFn: (row) => {
        return row.userId;
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="User ID" />;
      },
      cell: ({ row }) => <span>{row.getValue("userId")}</span>,
    },
    {
      accessorKey: "userImage",
      accessorFn: (row) => {
        return row.user?.image;
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="User Image" />;
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
      accessorKey: "userName",
      accessorFn: (row) => {
        return row.user?.name;
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="User Name" />;
      },
      cell: ({ row }) => <span>{row.getValue("userName")}</span>,
    },
    {
      accessorKey: "userEmail",
      accessorFn: (row) => {
        return row.user?.email;
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="User Email" />;
      },
      cell: ({ row }) => <span>{row.getValue("userEmail")}</span>,
    },
    {
      accessorKey: "userPhoneNumber",
      accessorFn: (row) => {
        return row.user?.phoneNumber;
      },
      header: ({ column }) => {
        return (
          <DataTableColumnHeader column={column} title="User Phone Number" />
        );
      },
      cell: ({ row }) => <span>{row.getValue("userPhoneNumber")}</span>,
    },
    {
      accessorKey: "status",
      accessorFn: (row) => {
        return row.status;
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Status" />;
      },
      cell: ({ row }) => (
        <span className="capitalize">{row.getValue("status")}</span>
      ),
    },

    {
      accessorKey: "competition",
      accessorFn: (row) => {
        return row.competition;
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
      accessorKey: "amount",
      accessorFn: (row) => {
        return row.amount;
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Amount" />;
      },
      cell: ({ row }) => <span>{row.getValue("amount")}</span>,
      filterFn: "includesString",
    },
    {
      accessorKey: "paymentUrl",
      accessorFn: (row) => {
        return row.paymentUrl;
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Payment URL" />;
      },
      cell: ({ row }) => {
        const paymentUrl = row.getValue("paymentUrl") as string;
        return (
          <Link
            href={paymentUrl}
            target="_blank"
            className="underline italic font-bold"
          >
            View
          </Link>
        );
      },
      filterFn: "includesString",
    },
    {
      accessorKey: "referenceDuitku",
      accessorFn: (row) => {
        return row.referenceDuitku;
      },
      header: ({ column }) => {
        return (
          <DataTableColumnHeader column={column} title="Reference Duitku" />
        );
      },
      cell: ({ row }) => <span>{row.getValue("referenceDuitku")}</span>,
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

  const deleteInvoice = useMutation({
    ...trpc.admin.deleteInvoice.mutationOptions(),
    onMutate: () => {
      toast.loading("Deleting invoice...", {
        id: "delete-invoice",
      });
    },
    onError: (error) => {
      toast.dismiss("delete-invoice");
      toast.error("Failed to delete invoice", {
        description: error.message,
      });
      console.log(error.message);
    },
    onSuccess() {
      toast.dismiss("delete-invoice");
      toast.success(`Invoice deleted successfully`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.admin.getInvoices.queryKey(),
      });
    },
  });

  const deleteInvoicesByMany = useMutation({
    ...trpc.admin.deleteInvoicesByMany.mutationOptions(),
    onMutate: () => {
      toast.loading("Deleting invoices...", {
        id: "delete-invoices",
      });
    },
    onError: (error) => {
      toast.dismiss("delete-invoices");
      toast.error("Failed to delete invoice", {
        description: error.message,
      });
      console.log(error.message);
    },
    onSuccess(data, variables) {
      toast.dismiss("delete-invoices");
      toast.success(
        `Deleted ${variables.invoiceIds.length} invoices successfully`,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.admin.getInvoices.queryKey(),
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
                  Payment ID
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("orderId");
                    table.getColumn("orderId")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  Order ID
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
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("userPhoneNumber");
                    table.getColumn("userPhoneNumber")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  User Phone Number
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("status");
                    table.getColumn("status")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  Status
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
                    setFilterColumn("amount");
                    table.getColumn("amount")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  Amount
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("referenceDuitku");
                    table.getColumn("referenceDuitku")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  Reference Duitku
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
                  onClick={() => {
                    const invoiceIds = table
                      .getFilteredSelectedRowModel()
                      .rows.map((row) => row.original.id);
                    const orderIds = table
                      .getFilteredSelectedRowModel()
                      .rows.map((row) => row.original.orderId);
                    deleteInvoicesByMany.mutate({ invoiceIds, orderIds });
                  }}
                  className="cursor-pointer"
                >
                  Delete {table.getFilteredSelectedRowModel().rows.length}{" "}
                  invoices
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
