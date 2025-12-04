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
import { toast } from "sonner";
import Image from "next/image";

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
      accessorKey: "image",
      accessorFn: (row) => {
        const user = users?.find((user) => user.id === row.user?.id);
        return user?.image ?? "";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="User Image" />;
      },
      cell: ({ row }) => {
        const imageUrl = row.getValue("image") as string;
        return (
          <>
            {imageUrl ? (
              <Link href={imageUrl} target="_blank">
                <div className="w-10 h-10 relative mx-auto">
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
      accessorKey: "userRegisteredTeam",
      accessorFn: (row) => {
        const user = users?.find((user) => user.id === row.user?.id);
        const userRegisteredTeam = user?.team_member.find(
          (member) => member.userId === row.user?.id
        );
        const userRegisteredTeamName = userRegisteredTeam?.team?.name;
        const isUserTeamRegistered =
          userRegisteredTeam?.team?.teamStatus === "ACCEPTED";
        if (!isUserTeamRegistered) {
          return "Not a member of any registered team";
        } else {
          return userRegisteredTeamName;
        }
      },
      header: ({ column }) => {
        return (
          <DataTableColumnHeader column={column} title="User Registered Team" />
        );
      },
      cell: ({ row }) => {
        const teamMember = row.getValue("userRegisteredTeam");
        return <span>{teamMember as unknown as string}</span>;
      },
      filterFn: "includesString",
    },
    {
      accessorKey: "comp_registration",
      accessorFn: (row) => {
        const user = users?.find((user) => user.id === row.userId);
        const userRegisteredMember = user?.team_member.find(
          (member) => member.userId === row.userId
        );
        const registeredComp = userRegisteredMember?.team?.competition;
        const isTeamRegistered =
          userRegisteredMember?.team?.teamStatus === "ACCEPTED";
        if (!isTeamRegistered) {
          return "Not registered to any competition";
        } else {
          return registeredComp;
        }
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Competition" />;
      },
      cell: ({ row }) => {
        const registration = row.getValue("comp_registration");
        return <span>{registration as unknown as string}</span>;
      },
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
              <DropdownMenuLabel>
                Actions for{" "}
                <span className="font-bold truncate">{item.user?.name}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  verifyAllDocuments.mutate({ userId: item.userId })
                }
                className="cursor-pointer"
              >
                Accept all documents
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  unVerifyAllDocuments.mutate({ userId: item.userId })
                }
                className="cursor-pointer"
              >
                Reject all documents
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(item.userId)}
                className="cursor-pointer"
              >
                Copy user ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                View user
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                View document details
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

  const verifyAllDocuments = useMutation({
    ...trpc.admin.verifyAllDocuments.mutationOptions(),
    onMutate: () => {
      toast.loading("Updating user documents...", {
        id: "update-documents",
      });
    },

    onError: (error) => {
      toast.dismiss("update-documents");
      toast.error("Failed to verify user documents", {
        description: error.message,
      });
      console.log(error.message);
    },
    onSuccess(data, variables) {
      toast.dismiss("update-documents");
      toast.success(
        `Documents verifed successfully for ${
          users?.find((user) => user.id === variables.userId)?.name
        }`
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.admin.getAllDocuments.queryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.admin.getUsers.queryKey(),
      });
    },
  });
  const unVerifyAllDocuments = useMutation({
    ...trpc.admin.unVerifyAllDocuments.mutationOptions(),
    onMutate: () => {
      toast.loading("Updating user documents...", {
        id: "update-documents",
      });
    },

    onError: (error) => {
      toast.dismiss("update-documents");
      toast.error("Failed to unverify user documents", {
        description: error.message,
      });
      console.log(error.message);
    },
    onSuccess(data, variables) {
      toast.dismiss("update-documents");
      toast.success(
        `Documents unverifed successfully for ${
          users?.find((user) => user.id === variables.userId)?.name
        }`
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.admin.getAllDocuments.queryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.admin.getUsers.queryKey(),
      });
    },
  });
  const verifyDocumentsByMany = useMutation({
    ...trpc.admin.verifyDocumentsByMany.mutationOptions(),
    onMutate: () => {
      toast.loading("Updating user documents...", {
        id: "update-documents",
      });
    },

    onError: (error) => {
      toast.dismiss("update-documents");
      toast.error("Failed to verify user documents", {
        description: error.message,
      });
      console.log(error.message);
    },
    onSuccess(data, variables) {
      toast.dismiss("update-documents");
      toast.success(
        `Documents verifed successfully for ${variables.userIds.length} users`
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.admin.getAllDocuments.queryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.admin.getUsers.queryKey(),
      });
      table.resetRowSelection();
    },
  });
  const unVerifyDocumentsByMany = useMutation({
    ...trpc.admin.unVerifyDocumentsByMany.mutationOptions(),
    onMutate: () => {
      toast.loading("Updating user documents...", {
        id: "update-documents",
      });
    },

    onError: (error) => {
      toast.dismiss("update-documents");
      toast.error("Failed to unverify user documents", {
        description: error.message,
      });
      console.log(error.message);
    },
    onSuccess(data, variables) {
      toast.dismiss("update-documents");
      toast.success(
        `Documents unverifed successfully for ${variables.userIds.length} users`
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.admin.getAllDocuments.queryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.admin.getUsers.queryKey(),
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
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("userRegisteredTeam");
                    table.getColumn("userRegisteredTeam")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  userRegisteredTeam
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("comp_registration");
                    table.getColumn("comp_registration")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  Competition
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
                    const userIds = table
                      .getFilteredSelectedRowModel()
                      .rows.map((row) => row.original.userId);
                    verifyDocumentsByMany.mutate({ userIds });
                  }}
                  className="cursor-pointer"
                >
                  Accept {table.getFilteredSelectedRowModel().rows.length}{" "}
                  user&apos;s documents
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    const userIds = table
                      .getFilteredSelectedRowModel()
                      .rows.map((row) => row.original.userId);
                    unVerifyDocumentsByMany.mutate({ userIds });
                  }}
                  className="cursor-pointer"
                >
                  Reject {table.getFilteredSelectedRowModel().rows.length}{" "}
                  user&apos;s documents
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
