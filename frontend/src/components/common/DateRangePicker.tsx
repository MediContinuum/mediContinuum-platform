import { useState } from "react";
import { CalendarDays, ChevronDown, X } from "lucide-react";
import { format } from "date-fns";
import { DayPicker, type DateRange } from "react-day-picker";
import * as Popover from "@radix-ui/react-popover";

import Button from "@/components/ui/button";

interface DateRangePickerProps {
  value?: DateRange;
  onChange: (range: DateRange | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  numberOfMonths?: number;
  className?: string;
}

function DateRangePicker({
  value,
  onChange,
  placeholder = "Select date range",
  disabled = false,
  numberOfMonths = 2,
  className = "",
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);

  const hasDateRange = Boolean(value?.from || value?.to);

  const displayValue = value?.from
    ? value.to
      ? `${format(value.from, "dd MMM yyyy")} - ${format(value.to, "dd MMM yyyy")}`
      : format(value.from, "dd MMM yyyy")
    : placeholder;

  const clearRange = () => {
    onChange(undefined);
    setOpen(false);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <div className={`inline-flex w-full items-center gap-2 ${className}`}>
        <Popover.Trigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className="h-10 w-full justify-start gap-2 font-normal"
          >
            <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />

            <span
              className={`flex-1 truncate text-left ${
                hasDateRange ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {displayValue}
            </span>

            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          </Button>
        </Popover.Trigger>

        {hasDateRange && !disabled && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={clearRange}
            aria-label="Clear date range"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          className="z-50 rounded-xl border border-border bg-popover p-3 text-popover-foreground shadow-lg"
        >
          <DayPicker
            mode="range"
            selected={value}
            onSelect={onChange}
            numberOfMonths={numberOfMonths}
            disabled={disabled}
            className="text-sm"
            classNames={{
              months: "flex flex-col gap-4 sm:flex-row",
              month: "space-y-4",
              month_caption: "flex items-center justify-center pt-1",
              caption_label: "text-sm font-semibold",
              nav: "flex items-center gap-1",
              button_previous:
                "absolute left-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-accent",
              button_next:
                "absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-accent",
              month_grid: "w-full border-collapse",
              weekdays: "flex",
              weekday:
                "w-9 rounded-md text-center text-xs font-medium text-muted-foreground",
              week: "mt-2 flex w-full",
              day: "relative h-9 w-9 p-0 text-center text-sm",
              day_button:
                "h-9 w-9 rounded-md p-0 font-normal hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selected:
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              range_start: "rounded-l-md bg-primary text-primary-foreground",
              range_end: "rounded-r-md bg-primary text-primary-foreground",
              range_middle: "rounded-none bg-accent text-accent-foreground",
              today: "font-bold text-primary",
              outside: "text-muted-foreground opacity-50",
              disabled: "cursor-not-allowed opacity-30",
              hidden: "invisible",
            }}
          />

          <div className="mt-3 flex justify-end border-t border-border pt-3">
            <Button type="button" size="sm" onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export default DateRangePicker;
