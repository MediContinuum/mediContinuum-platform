import { CalendarClock, Clock3, Pill } from "lucide-react";

import { useAdherence } from "../hooks/useAdherence";

import TodayMedicationList from "../components/TodayMedicationList";

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

  const takenCount = schedules.filter(
    (dose) => (dose.status ?? "").toUpperCase() === "TAKEN",
  ).length;

  const pendingCount = schedules.filter((dose) =>
    ["PENDING", "SCHEDULED"].includes((dose.status ?? "PENDING").toUpperCase()),
  ).length;

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

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total doses</p>

            <Pill className="size-5 text-[#087E8B]" />
          </div>

          <p className="mt-3 text-3xl font-semibold text-foreground">
            {schedules.length}
          </p>
        </article>

        <article className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Completed</p>

            <Clock3 className="size-5 text-emerald-600" />
          </div>

          <p className="mt-3 text-3xl font-semibold text-emerald-600">
            {takenCount}
          </p>
        </article>

        <article className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Pending</p>

            <CalendarClock className="size-5 text-amber-600" />
          </div>

          <p className="mt-3 text-3xl font-semibold text-amber-600">
            {pendingCount}
          </p>
        </article>
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
