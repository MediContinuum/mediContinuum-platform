import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import SearchBar from "@/components/common/SearchBar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchPlaceholder?: string;
  search?: boolean;
  emptyMessage?: string;
  className?: string;
}

function DataTable<TData, TValue>({
  columns,
  data,
  search = true,
  searchPlaceholder = "Search records...",
  emptyMessage = "No records found.",
  className = "",
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className={`w-full space-y-4 ${className}`}>
      {search && (
        <div className="flex items-center justify-between gap-3">
          <SearchBar
            value={globalFilter}
            onChange={setGlobalFilter}
            placeholder={searchPlaceholder}
            className="max-w-sm"
          />

          <p className="shrink-0 text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} records
          </p>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-border">
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
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
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={Math.max(table.getAllLeafColumns().length, 1)}
                    className="h-32 text-center text-muted-foreground"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
