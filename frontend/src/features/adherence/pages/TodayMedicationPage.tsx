import { useMemo, useState } from "react";
import { CalendarDays, Clock3, Pill } from "lucide-react";
import { toast } from "sonner";

import { useAdherence } from "../hooks/useAdherence";

import { getDoseDateKey, type MedicationDose } from "../types/adherence.types";

import TodayMedicationList from "../components/TodayMedicationList";
import SnoozeDialog from "../components/SnoozeDialog";

function getTodayKey(): string {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function TodayMedicationPage() {
  const {
    schedules,
    isLoading,
    isError,
    error,
    isUpdating,
    markDoseTaken,
    skipDose,
  } = useAdherence();

  const [selectedDose, setSelectedDose] = useState<MedicationDose | null>(null);

  const [isSnoozeOpen, setIsSnoozeOpen] = useState(false);

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  const today = getTodayKey();

  const todayDoses = useMemo(
    () => schedules.filter((dose) => getDoseDateKey(dose, timeZone) === today),
    [schedules, timeZone, today],
  );

  function openSnooze(dose: MedicationDose) {
    setSelectedDose(dose);
    setIsSnoozeOpen(true);
  }

  function handleSnooze(minutes: number) {
    toast.info(
      `Selected ${minutes}-minute snooze. Backend reminder scheduling is not connected yet.`,
    );

    setSelectedDose(null);
  }

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="text-sm text-muted-foreground">
          Loading today's medications...
        </div>
      </div>
    );
  }

  if (isError && todayDoses.length === 0) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6">
        <h2 className="font-semibold text-rose-800">
          Unable to load medication schedule
        </h2>

        <p className="mt-2 text-sm text-rose-700">
          {error instanceof Error ? error.message : "Please try again later."}
        </p>
      </div>
    );
  }

  return (
    <main className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-[#087E8B]">
            <Pill className="size-4" />
            Medication management
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            Today's medications
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Review your scheduled doses and update their status.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <CalendarDays className="size-4 text-[#087E8B]" />
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>

          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock3 className="size-3.5" />
            Timezone: {timeZone}
          </p>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Total scheduled doses</p>

          <p className="mt-2 text-3xl font-semibold text-foreground">
            {todayDoses.length}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Completed doses</p>

          <p className="mt-2 text-3xl font-semibold text-emerald-600">
            {
              todayDoses.filter(
                (dose) => (dose.status ?? "").toUpperCase() === "TAKEN",
              ).length
            }
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Pending doses</p>

          <p className="mt-2 text-3xl font-semibold text-amber-600">
            {
              todayDoses.filter((dose) =>
                ["PENDING", "SCHEDULED"].includes(
                  (dose.status ?? "PENDING").toUpperCase(),
                ),
              ).length
            }
          </p>
        </div>
      </section>

      <TodayMedicationList
        doses={todayDoses}
        timeZone={timeZone}
        isUpdating={isUpdating}
        onTaken={markDoseTaken}
        onSkipped={skipDose}
        onSnooze={openSnooze}
      />

      <SnoozeDialog
        open={isSnoozeOpen}
        dose={selectedDose}
        onClose={() => {
          setIsSnoozeOpen(false);
          setSelectedDose(null);
        }}
        onConfirm={handleSnooze}
      />
    </main>
  );
}

export default TodayMedicationPage;
