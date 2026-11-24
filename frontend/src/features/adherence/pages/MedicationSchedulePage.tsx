import { CalendarClock, Pill } from "lucide-react";

import { useAdherence } from "../hooks/useAdherence";

import TodayMedicationList from "../components/TodayMedicationList";

/** Displays server-supplied schedules; this page does not calculate status totals. */
function MedicationSchedulePage() {
  const {
    schedules,
    isLoading,
    isError,
    error,
    isUpdating,
    markDoseTaken,
    skipDose,
  } = useAdherence();

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading medication schedules...
        </p>
      </div>
    );
  }

  if (isError && schedules.length === 0) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6">
        <h2 className="font-semibold text-rose-800">
          Unable to load schedules
        </h2>

        <p className="mt-2 text-sm text-rose-700">
          {error instanceof Error ? error.message : "Please try again later."}
        </p>
      </div>
    );
  }

  return (
    <main className="space-y-6">
      <header>
        <div className="flex items-center gap-2 text-sm font-medium text-[#087E8B]">
          <CalendarClock className="size-4" />
          Medication management
        </div>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
          Medication schedules
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Review your scheduled medicines and dose instructions.
        </p>
      </header>

      {/* Count only the rows currently returned for display; statuses are not re-aggregated here. */}
      <section className="rounded-xl border border-border bg-card p-5">
        <p className="text-sm text-muted-foreground">Schedule entries returned</p>
        <p className="mt-2 text-3xl font-semibold text-foreground">
          {schedules.length.toLocaleString()}
        </p>
      </section>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-5">
          <h2 className="font-semibold text-foreground">
            Your medication plan
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Times are displayed using your browser's current timezone:{" "}
            {timeZone}.
          </p>
        </div>

        <TodayMedicationList
          doses={schedules}
          timeZone={timeZone}
          isUpdating={isUpdating}
          onTaken={markDoseTaken}
          onSkipped={skipDose}
        />
      </div>
    </main>
  );
}

export default MedicationSchedulePage;
