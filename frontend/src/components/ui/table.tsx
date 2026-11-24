import * as React from "react";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* TABLE                                                                       */
/* -------------------------------------------------------------------------- */

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div data-slot="table-container" className="relative w-full overflow-x-auto">
    <table
      ref={ref}
      data-slot="table"
      className={cn("w-full caption-bottom border-collapse text-sm", className)}
      {...props}
    />
  </div>
));

Table.displayName = "Table";

/* -------------------------------------------------------------------------- */
/* TABLE HEADER                                                                */
/* -------------------------------------------------------------------------- */

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    data-slot="table-header"
    className={cn("[&_tr]:border-b [&_tr]:border-border", className)}
    {...props}
  />
));

TableHeader.displayName = "TableHeader";

/* -------------------------------------------------------------------------- */
/* TABLE BODY                                                                  */
/* -------------------------------------------------------------------------- */

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    data-slot="table-body"
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));

TableBody.displayName = "TableBody";

/* -------------------------------------------------------------------------- */
/* TABLE FOOTER                                                                */
/* -------------------------------------------------------------------------- */

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    data-slot="table-footer"
    className={cn(
      "border-t border-border bg-muted/50 font-medium",
      "[&>tr]:last:border-b-0",
      className,
    )}
    {...props}
  />
));

TableFooter.displayName = "TableFooter";

/* -------------------------------------------------------------------------- */
/* TABLE ROW                                                                   */
/* -------------------------------------------------------------------------- */

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    data-slot="table-row"
    className={cn(
      "border-b border-border transition-colors",
      "hover:bg-muted/50",
      "data-[state=selected]:bg-muted",
      className,
    )}
    {...props}
  />
));

TableRow.displayName = "TableRow";

/* -------------------------------------------------------------------------- */
/* TABLE HEAD                                                                  */
/* -------------------------------------------------------------------------- */

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    data-slot="table-head"
    className={cn(
      "h-11 px-4 text-left align-middle",
      "text-xs font-semibold uppercase tracking-wide",
      "text-muted-foreground",
      "[&:has([role=checkbox])]:pr-0",
      className,
    )}
    {...props}
  />
));

TableHead.displayName = "TableHead";

/* -------------------------------------------------------------------------- */
/* TABLE CELL                                                                  */
/* -------------------------------------------------------------------------- */

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    data-slot="table-cell"
    className={cn(
      "px-4 py-3 align-middle",
      "text-sm text-foreground",
      "[&:has([role=checkbox])]:pr-0",
      className,
    )}
    {...props}
  />
));

TableCell.displayName = "TableCell";

/* -------------------------------------------------------------------------- */
/* TABLE CAPTION                                                               */
/* -------------------------------------------------------------------------- */

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    data-slot="table-caption"
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));

TableCaption.displayName = "TableCaption";

/* -------------------------------------------------------------------------- */
/* EXPORTS                                                                     */
/* -------------------------------------------------------------------------- */

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
