"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  defaultPageSize: number;
}

export function TokenDataTable<TData, TValue>({
  columns,
  data,
  defaultPageSize,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "createdAt",
      desc: true,
    },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: defaultPageSize,
      },
      sorting: [{ id: "createdAt", desc: true }],
    },
  });

  if (!data.length) {
    return (
      <div className="py-4 text-center">
        <p>No tokens found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex flex-col justify-between gap-1 py-1 sm:flex-row sm:items-center">
        <Input
          placeholder="Filter by token name..."
          value={(table.getColumn("token")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("token")?.setFilterValue(event.target.value)
          }
          className="max-w-sm rounded-xl text-white"
        />
      </div>
      <div className="rounded-xl">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-white font-bold">
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
                  className="cursor-pointer"
                  onClick={() => {
                    console.log(JSON.stringify(row, null, 2));
                    window.location.href = `/token/${
                      (row.original as { address: string }).address
                    }`;
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-white">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-white"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between px-4 py-1">
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2 text-white">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                          table.setPageSize(Number(value));
                        }}
                        defaultValue={defaultPageSize.toString()}
                      >
                        <SelectTrigger className="h-8 w-[70px] rounded-xl">
                          <SelectValue
                            placeholder={table.getState().pagination.pageSize}
                          />
                        </SelectTrigger>
                        <SelectContent side="top">
                          {[4, 10, 20, 30, 40, 50].map((pageSize) => (
                            <SelectItem key={pageSize} value={`${pageSize}`}>
                              {pageSize}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Rows per page</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium text-white">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2 py-1">
              <Button
                className="hidden h-8 w-8 p-0 lg:flex rounded-xl"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft className="h-4 w-4" color="#ffffff" />
              </Button>
              <Button
                className="h-8 w-8 p-0 rounded-xl"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="h-4 w-4" color="#ffffff" />
              </Button>
              <Button
                className="h-8 w-8 p-0 rounded-xl"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="h-4 w-4" color="#ffffff" />
              </Button>
              <Button
                className="hidden h-8 w-8 p-0 lg:flex rounded-xl"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight className="h-4 w-4" color="#ffffff" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
