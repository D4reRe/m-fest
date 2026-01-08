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
import Link from "next/link";
import Image from "next/image";

export function ExamDataTable() {
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
    data: examSubmissions,
    isLoading,
    isFetching,
  } = useQuery(trpc.admin.getExamSubmissions.queryOptions());
  const unified = React.useMemo(() => {
    if (!examSubmissions) return [];

    return examSubmissions;
  }, [examSubmissions]);

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
                onClick={() => navigator.clipboard.writeText(item.id)}
                className="cursor-pointer"
              >
                Copy quiz ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  deleteExamSubmission.mutate({
                    quizId: item.id,
                  });
                }}
                className="cursor-pointer"
                variant="destructive"
              >
                Delete Exam Submission
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: "id",
      accessorFn: (row) => {
        const examSubmission = examSubmissions?.find(
          (examSubmission) => examSubmission.id === row.id
        );
        return examSubmission?.id ?? "";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Quiz Id" />;
      },
      cell: ({ row }) => <span>{row.getValue("id")}</span>,
      filterFn: "includesString",
    },
    {
      accessorKey: "userId",
      accessorFn: (row) => {
        const examSubmission = examSubmissions?.find(
          (examSubmission) => examSubmission.id === row.id
        );
        return examSubmission?.userId ?? "";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="User Id" />;
      },
      cell: ({ row }) => <span>{row.getValue("userId")}</span>,
      filterFn: "includesString",
    },
    {
      accessorKey: "image",
      accessorFn: (row) => {
        const examSubmission = examSubmissions?.find(
          (examSubmission) => examSubmission.id === row.id
        );
        return examSubmission?.user.image ?? "";
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
      accessorKey: "userName",
      accessorFn: (row) => {
        const examSubmission = examSubmissions?.find(
          (examSubmission) => examSubmission.id === row.id
        );
        return examSubmission?.user.name ?? "";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="User Name" />;
      },
      cell: ({ row }) => <span>{row.getValue("userName")}</span>,
      filterFn: "includesString",
    },
    {
      accessorKey: "userEmail",
      accessorFn: (row) => {
        const examSubmission = examSubmissions?.find(
          (examSubmission) => examSubmission.id === row.id
        );
        return examSubmission?.user.email ?? "";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="User Email" />;
      },
      cell: ({ row }) => <span>{row.getValue("userEmail")}</span>,
      filterFn: "includesString",
    },
    {
      accessorKey: "score",
      accessorFn: (row) => {
        const examSubmission = examSubmissions?.find(
          (examSubmission) => examSubmission.id === row.id
        );
        return examSubmission?.score ?? "";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Score" />;
      },
      cell: ({ row }) => <span>{row.getValue("score")}</span>,
      filterFn: "includesString",
    },
    {
      accessorKey: "totalQuestions",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader column={column} title="Total Questions" />
        );
      },
      accessorFn: (row) => {
        const examSubmission = examSubmissions?.find(
          (examSubmission) => examSubmission.id === row.id
        );
        return examSubmission?.totalQuestions ?? "";
      },
      cell: ({ row }) => <span>{row.getValue("totalQuestions")}</span>,
      filterFn: "includesString",
    },
    {
      accessorKey: "timeSpent",
      accessorFn: (row) => {
        const examSubmission = examSubmissions?.find(
          (examSubmission) => examSubmission.id === row.id
        );
        return examSubmission?.timeSpent ?? "";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Time Spent" />;
      },
      cell: ({ row }) => <span className="">{row.getValue("timeSpent")}</span>,
      filterFn: "includesString",
    },
    {
      accessorKey: "answers",
      accessorFn: (row) => {
        const examSubmission = examSubmissions?.find(
          (examSubmission) => examSubmission.id === row.id
        );
        return (
          examSubmission?.answers?.toString() ?? "Not a multiple choice answer"
        );
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Answers" />;
      },
      cell: ({ row }) => {
        const compName = row.getValue("answers") as string;
        return <span className="capitalize">{compName}</span>;
      },
      filterFn: "includesString",
    },
    {
      accessorKey: "type",
      accessorFn: (row) => {
        const examSubmission = examSubmissions?.find(
          (examSubmission) => examSubmission.id === row.id
        );
        return examSubmission?.type ?? "";
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Type" />;
      },
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        return <span className="capitalize">{type}</span>;
      },
    },
    {
      accessorKey: "essayAnswerFileUrl",
      accessorFn: (row) => {
        const examSubmission = examSubmissions?.find(
          (examSubmission) => examSubmission.id === row.id
        );
        return examSubmission?.essayAnswerFileUrl ?? "Not an essay type";
      },
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title="Essay Answer File Url"
          />
        );
      },
      cell: ({ row }) => (
        <span>
          {row.getValue("essayAnswerFileUrl") !== "Not an essay type" ? (
            <Link
              href={row.getValue("essayAnswerFileUrl")}
              target="_blank"
              className="underline italic font-bold"
            >
              View
            </Link>
          ) : (
            <span>No File</span>
          )}
        </span>
      ),
      filterFn: "includesString",
    },
    {
      accessorKey: "essayAnswerFileKey",
      accessorFn: (row) => {
        const examSubmission = examSubmissions?.find(
          (examSubmission) => examSubmission.id === row.id
        );
        return examSubmission?.essayAnswerFileKey ?? "Not an essay type";
      },
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title="Essay Answer File Key"
          />
        );
      },
      cell: ({ row }) => {
        const fileKey = row.getValue("essayAnswerFileKey") as string;
        return <span>{fileKey}</span>;
      },
    },
    {
      accessorKey: "createdAt",
      accessorFn: (row) => {
        const examSubmission = examSubmissions?.find(
          (examSubmission) => examSubmission.id === row.id
        );
        return examSubmission?.createdAt
          ? new Date(examSubmission.createdAt).toLocaleString()
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

  const deleteExamSubmission = useMutation({
    ...trpc.admin.deleteExamSubmission.mutationOptions(),
    onMutate: () => {
      toast.loading("Deleting exam submission...", {
        id: "delete-exam-submission",
      });
    },
    onError: (error) => {
      toast.dismiss("delete-exam-submission");
      toast.error("Failed to delete exam submission", {
        description: error.message,
      });
      console.log(error.message);
    },
    onSuccess() {
      toast.dismiss("delete-exam-submission");
      toast.success(`Deleted exam submission successfully`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.admin.getExamSubmissions.queryKey(),
      });
    },
  });
  const deleteExamSubmissionByMany = useMutation({
    ...trpc.admin.deleteExamSubmissionByMany.mutationOptions(),
    onMutate: () => {
      toast.loading("Deleting exam submissions...", {
        id: "delete-exam-submissions",
      });
    },
    onError: (error) => {
      toast.dismiss("delete-exam-submissions");
      toast.error("Failed to delete exam submissions", {
        description: error.message,
      });
      console.log(error.message);
    },
    onSuccess(data, variables) {
      toast.dismiss("delete-exam-submissions");
      toast.success(
        `Deleted ${variables.quizIds.length} exam submissions successfully`
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.admin.getExamSubmissions.queryKey(),
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
                  Exam Submission ID
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
                    setFilterColumn("score");
                    table.getColumn("score")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  Score
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("totalQuestions");
                    table.getColumn("totalQuestions")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  Total Questions
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("timeSpent");
                    table.getColumn("timeSpent")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  Time Spent
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("answers");
                    table.getColumn("answers")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  Answers
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("type");
                    table.getColumn("type")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  Type
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("essayAnswerFileUrl");
                    table.getColumn("essayAnswerFileUrl")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  Essay Answer File Url
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setFilterColumn("essayAnswerFileKey");
                    table.getColumn("essayAnswerFileKey")?.setFilterValue("");
                    table.resetColumnFilters();
                  }}
                >
                  Essay Answer File Key
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
                  variant="destructive"
                  onClick={() => {
                    const quizIds = table
                      .getFilteredSelectedRowModel()
                      .rows.map((row) => row.original.id);
                    deleteExamSubmissionByMany.mutate({
                      quizIds,
                    });
                  }}
                  className="cursor-pointer"
                >
                  Delete {table.getFilteredSelectedRowModel().rows.length}{" "}
                  submissions
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
