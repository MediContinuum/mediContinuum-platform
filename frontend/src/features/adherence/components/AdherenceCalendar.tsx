import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

import type { MedicationDose } from "../types/adherence.types";

import { getDoseDateKey, getDoseStatus } from "../types/adherence.types";

interface AdherenceCalendarProps {
  doses: MedicationDose[];
  selectedDate?: string;
  timeZone?: string;
  onSelectDate?: (date: string) => void;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function AdherenceCalendar({
  doses,
  selectedDate,
  timeZone,
  onSelectDate,
}: AdherenceCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();

    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const monthLabel = currentMonth.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const days = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstWeekday = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    return [
      ...Array.from({ length: firstWeekday }, () => null),
      ...Array.from({ length: totalDays }, (_, index) => index + 1),
    ];
  }, [currentMonth]);

  const groupedDoses = useMemo(() => {
    const groups: Record<string, MedicationDose[]> = {};

    doses.forEach((dose) => {
      const date = getDoseDateKey(dose, timeZone);

      if (!date) return;

      groups[date] ??= [];
      groups[date].push(dose);
    });

    return groups;
  }, [doses, timeZone]);

  function changeMonth(direction: number) {
    setCurrentMonth((current) => {
      return new Date(current.getFullYear(), current.getMonth() + direction, 1);
    });
  }

  const today = toDateKey(new Date());

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#E5F3F4] text-[#087E8B]">
            <CalendarDays className="size-5" />
          </div>

          <div>
            <h2 className="font-semibold text-foreground">
              Adherence calendar
            </h2>

            <p className="text-sm text-muted-foreground">
              Select a date to view its medication records.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => changeMonth(-1)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
          >
            <ChevronLeft className="size-5" />
          </button>

          <button
            type="button"
            aria-label="Next month"
            onClick={() => changeMonth(1)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      <div className="mt-6 text-center text-sm font-semibold text-foreground">
        {monthLabel}
      </div>

      <div className="mt-5 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}

        {days.map((day, index) => {
          if (day === null) {
            return <div key={`blank-${index}`} className="aspect-square" />;
          }

          const dateKey = toDateKey(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day),
          );

          const dayDoses = groupedDoses[dateKey] ?? [];

          const hasTaken = dayDoses.some(
            (dose) => getDoseStatus(dose) === "TAKEN",
          );

          const hasMissed = dayDoses.some(
            (dose) => getDoseStatus(dose) === "MISSED",
          );

          const isSelected = selectedDate === dateKey;
          const isToday = today === dateKey;

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => onSelectDate?.(dateKey)}
              aria-label={`${dateKey}, ${dayDoses.length} doses`}
              aria-pressed={isSelected}
              className={`relative flex aspect-square flex-col items-center justify-center rounded-lg text-sm transition-colors ${
                isSelected
                  ? "bg-[#12304A] font-semibold text-white"
                  : isToday
                    ? "border border-[#087E8B] bg-[#E5F3F4] font-semibold text-[#087E8B]"
                    : "text-foreground hover:bg-muted"
              }`}
            >
              {day}

              {dayDoses.length > 0 && (
                <span className="absolute bottom-1.5 flex gap-0.5">
                  <span
                    className={`size-1.5 rounded-full ${
                      hasTaken
                        ? "bg-emerald-500"
                        : hasMissed
                          ? "bg-rose-500"
                          : isSelected
                            ? "bg-white"
                            : "bg-amber-500"
                    }`}
                  />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap gap-4 border-t border-border pt-4">
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="size-2 rounded-full bg-emerald-500" />
          Taken
        </span>

        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="size-2 rounded-full bg-rose-500" />
          Missed
        </span>

        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="size-2 rounded-full bg-amber-500" />
          Other scheduled doses
        </span>
      </div>
    </section>
  );
}

export default AdherenceCalendar;
