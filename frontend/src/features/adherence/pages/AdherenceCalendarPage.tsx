import { useMemo, useState } from "react";
import { CalendarDays } from "lucide-react";

import { useAdherence } from "../hooks/useAdherence";

import { getDoseDateKey, type MedicationDose } from "../types/adherence.types";

import AdherenceCalendar from "../components/AdherenceCalendar";
import TodayMedicationList from "../components/TodayMedicationList";

function getTodayKey(): string {
  const date = new Date();

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function AdherenceCalendarPage() {
  const {
    schedules,
    isLoading,
    isError,
    error,
    markDoseTaken,
    skipDose,
    isUpdating,
  } = useAdherence();

  const [selectedDate, setSelectedDate] = useState(getTodayKey());

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  const selectedDoses = useMemo(
    () =>
      schedules.filter(
        (dose) => getDoseDateKey(dose, timeZone) === selectedDate,
      ),
    [schedules, selectedDate, timeZone],
  );

  const handleSnooze = (_dose: MedicationDose) => {
    // The backend does not currently expose a confirmed snooze endpoint.
  };

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading adherence calendar...
        </p>
      </div>
    );
  }

  if (isError && schedules.length === 0) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-800">
        <h2 className="font-semibold">Calendar unavailable</h2>
        <p className="mt-2 text-sm">
          {error instanceof Error ? error.message : "Unable to load records."}
        </p>
      </div>
    );
  }

  return (
    <main className="space-y-6">
      <header>
        <div className="flex items-center gap-2 text-sm font-medium text-[#087E8B]">
          <CalendarDays className="size-4" />
          Medication adherence
        </div>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
          Adherence calendar
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Review your medication activity by date.
        </p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AdherenceCalendar
          doses={schedules}
          selectedDate={selectedDate}
          timeZone={timeZone}
          onSelectDate={setSelectedDate}
        />

        <section className="rounded-xl border border-border bg-card p-5">
          <div className="mb-5">
            <p className="text-xs font-medium uppercase tracking-wide text-[#087E8B]">
              Selected date
            </p>

            <h2 className="mt-1 text-xl font-semibold text-foreground">
              {new Date(`${selectedDate}T12:00:00`).toLocaleDateString(
                "en-IN",
                {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                },
              )}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {selectedDoses.length} scheduled dose
              {selectedDoses.length === 1 ? "" : "s"}
            </p>
          </div>

          <TodayMedicationList
            doses={selectedDoses}
            timeZone={timeZone}
            isUpdating={isUpdating}
            onTaken={markDoseTaken}
            onSkipped={skipDose}
            onSnooze={handleSnooze}
          />
        </section>
      </div>
    </main>
  );
}

export default AdherenceCalendarPage;
