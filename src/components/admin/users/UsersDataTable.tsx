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
  BadgeCheckIcon,
  Loader2,
  MoreHorizontal,
  RefreshCw,
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
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
import Image from "next/image";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { userRoles } from "@/constants/constants";
import type { Role } from "../../../../prisma/generated/prisma/enums";
import { Badge } from "@/components/ui/badge";

export function UsersDataTable() {
  const trpc = useTRPC();
  const { data: session } = authClient.useSession();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [filterColumn, setFilterColumn] = React.useState<string>("email");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const queryClient = useQueryClient();
  const {
    data: users,
    isLoading,
    isFetching,
  } = useQuery(trpc.admin.getUsers.queryOptions());
  const unified = React.useMemo(() => {
    if (!users) return [];

    return users;
  }, [users]);

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
                className="cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(item.id);
                  toast.success("User ID copied to clipboard");
                }}
              >
                Copy user ID
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(item.email);
                  toast.success("Email copied to clipboard");
                }}
              >
                Copy email
              </DropdownMenuItem>

              {session?.user.role === "SUPERADMIN" &&
                item.role !== "SUPERADMIN" && (
                  <>
                    {userRoles
                      .filter((role) => role !== item.role)
                      .map((role) => (
                        <DropdownMenuItem
                          key={role}
                          className="cursor-pointer text-yellow-500 hover:text-yellow-500! hover:bg-yellow-900/60!"
                          onClick={() =>
                            updateUserRole.mutate({
                              userId: item.id,
                              role: role as Role,
                            })
                          }
                        >
                          Update role to {role}
                        </DropdownMenuItem>
                      ))}
                  </>
                )}
              <DropdownMenuItem
                className="cursor-pointer text-red-500"
                onClick={() => deleteUser.mutate({ userId: item.id })}
                variant="destructive"
                disabled={item.id === session?.user.id}
              >
                {item.id === session?.user.id
                  ? "You cannot delete yourself"
                  : "Delete User"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Link
                  href={`/admin/users/${item.id}`}
                  target="_blank"
                  className="w-full"
                >
                  View User
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                {" "}
                <Link
                  href={`/admin/users/${item.id}#documents`}
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
    {
      accessorKey: "verified",
      accessorFn: (row) => {
        const user = users?.find((user) => user.id === row.id);
        if (!user?.verified && row.documents?.status === "PENDING") {
          return "Pending";
        } else if (user?.verified && row.documents?.status === "ACCEPTED") {
          return "Verified";
        } else {
          return "Not Verified";
        }
      },
      header: ({ column }) => {
        return (
          <DataTableColumnHeader column={column} title="Verified Status" />
        );
      },
      cell: ({ getValue, row }) => (
        <span>
          {row.original.documents?.status === "PENDING" ? (
            <Badge variant="secondary" className="bg-yellow-600 text-white">
              Pending
            </Badge>
          ) : getValue<string>() === "Verified" &&
            row.original.documents?.status === "ACCEPTED" ? (
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
      accessorKey: "id",
      accessorFn: (row) => {
        const user = users?.find((user) => user.id === row.id);
        return user?.id ?? "";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="User Id" />;
      },
      cell: ({ row }) => (
        <span className="capitalize">{row.getValue("id")}</span>
      ),
      filterFn: "includesString",
    },
    {
      accessorKey: "role",
      accessorFn: (row) => {
        const user = users?.find((user) => user.id === row.id);
        return user?.role ?? "";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Role" />;
      },
      cell: ({ row }) => <span>{row.getValue("role")}</span>,
      filterFn: "includesString",
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Name" />;
      },
      cell: ({ row }) => (
        <span className="capitalize">{row.getValue("name")}</span>
      ),
      filterFn: "includesString",
    },
    {
      accessorKey: "email",
      accessorFn: (row) => {
        const user = users?.find((user) => user.id === row.id);
        return user?.email ?? "";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Email" />;
      },
      cell: ({ row }) => (
        <span className="lowercase">{row.getValue("email")}</span>
      ),
      filterFn: "includesString",
    },
    {
      accessorKey: "emailVerified",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Email Verified" />;
      },
      accessorFn: (row) => {
        const user = users?.find((user) => user.id === row.id);
        return user?.emailVerified ? "Verified" : "Not Verified";
      },
      cell: ({ row }) => <span>{row.getValue("emailVerified")}</span>,
      filterFn: "includesString",
    },
    {
      accessorKey: "image",
      accessorFn: (row) => {
        const user = users?.find((user) => user.id === row.id);
        return user?.image ?? "";
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
      accessorKey: "imageKey",
      accessorFn: (row) => {
        const user = users?.find((user) => user.id === row.id);
        return user?.imageKey ?? "Image URL was set by the social provider";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Image Key" />;
      },
      cell: ({ row }) => <span>{row.getValue("imageKey")}</span>,
      filterFn: "includesString",
    },
    {
      accessorKey: "gender",
      accessorFn: (row) => {
        const user = users?.find((user) => user.id === row.id);
        return user?.gender ?? "Not set";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Gender" />;
      },
      cell: ({ row }) => <span>{row.getValue("gender")}</span>,
      filterFn: "includesString",
    },
    {
      accessorKey: "phoneNumber",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Phone Number" />;
      },
      accessorFn: (row) => {
        const user = users?.find((user) => user.id === row.id);
        return user?.phoneNumber ?? "Not set";
      },
      cell: ({ row }) => <span>{row.getValue("phoneNumber")}</span>,
      filterFn: "includesString",
    },
    {
      accessorKey: "institution",
      accessorFn: (row) => {
        const user = users?.find((user) => user.id === row.id);
        return user?.institution ?? "Not set";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Institution" />;
      },
      cell: ({ row }) => <span>{row.getValue("institution")}</span>,
      filterFn: "includesString",
    },
    {
      accessorKey: "domicile",
      accessorFn: (row) => {
        const user = users?.find((user) => user.id === row.id);
        return user?.domicile ?? "Not set";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Domicile" />;
      },
      cell: ({ row }) => {
        const domicile = row.getValue("domicile") as string;
        return <span>{domicile}</span>;
      },
      filterFn: "includesString",
    },
    {
      accessorKey: "major",
      accessorFn: (row) => {
        const user = users?.find((user) => user.id === row.id);
        return user?.major ?? "Not set";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Major" />;
      },
      cell: ({ row }) => {
        return <span>{row.getValue("major")}</span>;
      },
      filterFn: "includesString",
    },
    {
      accessorKey: "semester",
      accessorFn: (row) => {
        const user = users?.find((user) => user.id === row.id);
        return user?.semester ?? "Not set";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Semester" />;
      },
      cell: ({ row }) => {
        return <span>{row.getValue("semester")}</span>;
      },
    },
    {
      accessorKey: "education",
      accessorFn: (row) => {
        const user = users?.find((user) => user.id === row.id);
        return user?.education ?? "Not set";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Education" />;
      },
      cell: ({ row }) => {
        return <span>{row.getValue("education")}</span>;
      },
      filterFn: "includesString",
    },
    {
      accessorKey: "birthDate",
      accessorFn: (row) => {
        const user = users?.find((user) => user.id === row.id);
        return user?.birthDate
          ? new Date(user.birthDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "Not set";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Birth Date" />;
      },
      cell: ({ row }) => {
        return <span>{row.getValue("birthDate")}</span>;
      },
    },
    {
      accessorKey: "createdAt",
      accessorFn: (row) => {
        const user = users?.find((user) => user.id === row.id);
        return user?.createdAt
          ? new Date(user.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "Not set";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Created At" />;
      },
      cell: ({ row }) => {
        return <span>{row.getValue("createdAt")}</span>;
      },
    },
    {
      accessorKey: "comp_registration",
      accessorFn: (row) => {
        const user = users?.find((user) => user.id === row.id);
        const userRegisteredMember = user?.team_member.find(
          (member) => member.userId === row.id,
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
      accessorKey: "userRegisteredTeam",
      accessorFn: (row) => {
        const user = users?.find((user) => user.id === row.id);
        const userRegisteredTeam = user?.team_member.find(
          (member) => member.userId === row.id,
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
      accessorKey: "IdentityCard",
      accessorFn: (row) => {
        const user = users?.find((user) => user.id === row.id);
        return user?.documents?.identityCardImageUrl ?? "No File";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Identity Card" />;
      },
      cell: ({ row }) => {
        const identityCardUrl = row.getValue("IdentityCard") as string;
        return (
          <>
            {identityCardUrl !== "No File" ? (
              <Link
                href={(identityCardUrl as string) ?? ""}
                className={cn(
                  identityCardUrl ? "underline italic font-bold" : "",
                )}
                target="_blank"
              >
                {identityCardUrl ? "View" : "No File"}
              </Link>
            ) : (
              <span>No File</span>
            )}
          </>
        );
      },
    },
    {
      accessorKey: "twibbon",
      accessorFn: (row) => {
        const user = users?.find((user) => user.id === row.id);
        return user?.documents?.twibbonImageUrl ?? "No File";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Twibbon" />;
      },
      cell: ({ row }) => {
        const twibbonUrl = row.getValue("twibbon") as string;
        return (
          <>
            {twibbonUrl !== "No File" ? (
              <Link
                href={(twibbonUrl as string) ?? ""}
                className={cn(twibbonUrl ? "underline italic font-bold" : "")}
                target="_blank"
              >
                {twibbonUrl ? "View" : "No File"}
              </Link>
            ) : (
              <span>No File</span>
            )}
          </>
        );
      },
    },
    {
      accessorKey: "followIg",
      accessorFn: (row) => {
        const user = users?.find((user) => user.id === row.id);
        return user?.documents?.followIgImageUrl ?? "No File";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Follow IG" />;
      },
      cell: ({ row }) => {
        const followIgUrl = row.getValue("followIg") as string;
        return (
          <>
            {followIgUrl !== "No File" ? (
              <Link
                href={(followIgUrl as string) ?? ""}
                className={cn(followIgUrl ? "underline italic font-bold" : "")}
                target="_blank"
              >
                {followIgUrl ? "View" : "No File"}
              </Link>
            ) : (
              <span>No File</span>
            )}
          </>
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

  const updateUserRole = useMutation({
    ...trpc.admin.updateUserRole.mutationOptions(),
    onMutate: () => {
      toast.loading("Updating user role...", {
        id: "update-user-role",
      });
    },
    onError: (error) => {
      toast.dismiss("update-user-role");
      toast.error("Failed to update user role", {
        description: error.message,
      });
      console.log(error.message);
    },
    onSuccess() {
      toast.success("User role updated successfully", {
        id: "update-user-role",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.admin.getUsers.queryKey(),
      });
    },
  });

  const deleteUser = useMutation({
    ...trpc.admin.deleteUser.mutationOptions(),
    onMutate: () => {
      toast.loading("Deleting user...", {
        id: "delete-user",
      });
    },

    onError: (error) => {
      toast.dismiss("delete-user");
      toast.error("Failed to delete user", {
        description: error.message,
      });
      console.log(error.message);
    },
    onSuccess() {
      toast.dismiss("delete-user");
      toast.success(`User deleted successfully`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.admin.getUsers.queryKey(),
      });
    },
  });

  const deleteUserByMany = useMutation({
    ...trpc.admin.deleteUsersByMany.mutationOptions(),
    onMutate: () => {
      toast.loading("Deleting users...", {
        id: "delete-user",
      });
    },
    onError: (error) => {
      toast.dismiss("delete-user");
      toast.error("Failed to delete users", {
        description: error.message,
      });
      console.log(error.message);
    },
    onSuccess(data, variables) {
      toast.dismiss("delete-user");
      toast.success(`Deleted ${variables.userIds.length} users successfully`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.admin.getUsers.queryKey(),
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
                  User Id
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("name");
                    table.getColumn("name")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  Name
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("email");
                    table.getColumn("email")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  Email
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("phoneNumber");
                    table.getColumn("phoneNumber")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  Phone Number
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("institution");
                    table.getColumn("institution")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  Institution
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("major");
                    table.getColumn("major")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  Major
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("domicile");
                    table.getColumn("domicile")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  Domicile
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("education");
                    table.getColumn("education")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  Education
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("role");
                    table.getColumn("role")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  Role
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
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("userRegisteredTeam");
                    table.getColumn("userRegisteredTeam")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  User Registered Team
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
                    const userIds = table
                      .getFilteredSelectedRowModel()
                      .rows.map((row) => row.original.id);
                    deleteUserByMany.mutate({ userIds });
                  }}
                  className="cursor-pointer"
                >
                  Delete {table.getFilteredSelectedRowModel().rows.length} users
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
        <DataTableViewOptions table={table} />
      </div>
      <div className="w-full overflow-x-auto rounded-md border mb-2">
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
