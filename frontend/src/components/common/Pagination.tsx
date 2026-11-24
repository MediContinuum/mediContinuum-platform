import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import type { Table as TanStackTable } from "@tanstack/react-table";

import Button from "@/components/ui/button";

interface PaginationProps<TData> {
  table: TanStackTable<TData>;
  pageSizeOptions?: number[];
  showPageSize?: boolean;
  className?: string;
}

function Pagination<TData>({
  table,
  pageSizeOptions = [10, 20, 50, 100],
  showPageSize = true,
  className = "",
}: PaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = table.getFilteredRowModel().rows.length;
  const totalPages = table.getPageCount();

  const start = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div
      className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <span>
          Showing{" "}
          <strong className="text-foreground">
            {start}-{end}
          </strong>{" "}
          of <strong className="text-foreground">{totalRows}</strong>
        </span>

        {showPageSize && (
          <label className="flex items-center gap-2">
            Rows per page
            <select
              value={pageSize}
              onChange={(event) =>
                table.setPageSize(Number(event.target.value))
              }
              className="h-9 rounded-md border border-input bg-background px-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Rows per page"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          aria-label="First page"
        >
          <ChevronFirst className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className="min-w-24 px-2 text-center text-sm text-muted-foreground">
          Page {totalPages === 0 ? 0 : pageIndex + 1} of {totalPages}
        </span>

        <Button
          variant="outline"
          size="icon"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => table.setPageIndex(Math.max(totalPages - 1, 0))}
          disabled={!table.getCanNextPage()}
          aria-label="Last page"
        >
          <ChevronLast className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default Pagination;
