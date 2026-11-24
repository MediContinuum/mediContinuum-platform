import { CalendarDays, Clock3, History, Pill } from "lucide-react";

import type { MedicationDose } from "../types/adherence.types";

import {
  getDoseDateKey,
  getDoseDisplayTime,
  getDoseDosage,
  getDoseMedicineName,
  getDoseStatus,
  getDoseStatusClass,
  getDoseStatusLabel,
} from "../types/adherence.types";

interface AdherenceHistoryProps {
  doses: MedicationDose[];
  timeZone?: string;
}

function AdherenceHistory({ doses, timeZone }: AdherenceHistoryProps) {
  const history = [...doses].sort((first, second) => {
    const firstDate = first.scheduledAt ?? first.scheduledDate ?? "";
    const secondDate = second.scheduledAt ?? second.scheduledDate ?? "";

    return secondDate.localeCompare(firstDate);
  });

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-14 text-center">
        <History className="size-8 text-muted-foreground" />

        <h3 className="mt-4 font-semibold text-foreground">
          No adherence history
        </h3>

        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Your recorded medication activity will appear here.
        </p>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <h2 className="font-semibold text-foreground">Medication history</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {history.length} recorded schedule entries
        </p>
      </div>

      <div className="divide-y divide-border">
        {history.map((dose, index) => {
          const status = getDoseStatus(dose);

          return (
            <article
              key={dose.doseScheduleId ?? dose.scheduleId ?? dose.id ?? index}
              className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#E5F3F4] text-[#087E8B]">
                  <Pill className="size-5" />
                </div>

                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">
                    {getDoseMedicineName(dose)}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {getDoseDosage(dose)}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="size-3.5" />
                      {getDoseDateKey(dose, timeZone) || "Date unavailable"}
                    </span>

                    <span className="flex items-center gap-1">
                      <Clock3 className="size-3.5" />
                      {getDoseDisplayTime(dose, timeZone)}
                    </span>
                  </div>
                </div>
              </div>

              <span
                className={`inline-flex w-fit shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${getDoseStatusClass(status)}`}
              >
                {getDoseStatusLabel(status)}
              </span>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default AdherenceHistory;
