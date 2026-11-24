
import { useState } from "react";
import { Filter, RotateCcw, X } from "lucide-react";

import type { Table as TanStackTable } from "@tanstack/react-table";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

interface FilterPanelProps<TData> {
  table: TanStackTable<TData>;
  title?: string;
  showGlobalSearch?: boolean;
  className?: string;
}

function FilterPanel<TData>({
  table,
  title = "Filters",
  showGlobalSearch = true,
  className = "",
}: FilterPanelProps<TData>) {
  const [expanded, setExpanded] = useState(true);

  const filterableColumns = table
    .getAllLeafColumns()
    .filter((column) => column.getCanFilter());

  const activeFilterCount = table.getState().columnFilters.filter((filter) => {
    const value = filter.value;
    return value !== undefined && value !== null && value !== "";
  }).length;

  const hasGlobalFilter = Boolean(table.getState().globalFilter);

  const clearFilters = () => {
    table.resetColumnFilters();
    table.setGlobalFilter("");
  };

  return (
    <section
      className={`rounded-lg border border-border bg-card ${className}`}
      aria-label="Table filters"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 p-4">
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-foreground"
          aria-expanded={expanded}
        >
          <Filter className="h-4 w-4 text-muted-foreground" />
          {title}

          {(activeFilterCount > 0 || hasGlobalFilter) && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {activeFilterCount + (hasGlobalFilter ? 1 : 0)}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2">
          {(activeFilterCount > 0 || hasGlobalFilter) && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearFilters}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          )}

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setExpanded((current) => !current)}
            aria-label={expanded ? "Collapse filters" : "Expand filters"}
          >
            {expanded ? (
              <X className="h-4 w-4" />
            ) : (
              <Filter className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="grid grid-cols-1 gap-4 border-t border-border p-4 sm:grid-cols-2 lg:grid-cols-3">
          {showGlobalSearch && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Search all columns
              </label>

              <Input
                value={String(table.getState().globalFilter ?? "")}
                onChange={(event) => table.setGlobalFilter(event.target.value)}
                placeholder="Search records..."
                aria-label="Search all columns"
              />
            </div>
          )}

          {filterableColumns.map((column) => {
            const currentValue = column.getFilterValue();

            return (
              <div key={column.id} className="space-y-2">
                <label
                  htmlFor={`filter-${column.id}`}
                  className="text-sm font-medium capitalize text-foreground"
                >
                  {column.id.replace(/([A-Z])/g, " $1")}
                </label>

                <Input
                  id={`filter-${column.id}`}
                  value={
                    currentValue === undefined || currentValue === null
                      ? ""
                      : String(currentValue)
                  }
                  onChange={(event) =>
                    column.setFilterValue(event.target.value || undefined)
                  }
                  placeholder={`Filter ${column.id}...`}
                />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default FilterPanel;
