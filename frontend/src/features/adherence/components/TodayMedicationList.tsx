import { ClipboardList, Pill } from "lucide-react";

import type { MedicationDose } from "../types/adherence.types";

import MedicationScheduleCard from "./MedicationScheduleCard";

interface TodayMedicationListProps {
  doses: MedicationDose[];
  timeZone?: string;
  isUpdating?: boolean;
  onTaken?: (id: string) => void;
  onSkipped?: (id: string) => void;
  onSnooze?: (dose: MedicationDose) => void;
}

function TodayMedicationList({
  doses,
  timeZone,
  isUpdating = false,
  onTaken,
  onSkipped,
  onSnooze,
}: TodayMedicationListProps) {
  if (doses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-14 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-[#E5F3F4] text-[#087E8B]">
          <Pill className="size-7" />
        </div>

        <h3 className="mt-4 font-semibold text-foreground">
          No medications scheduled
        </h3>

        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Your medication doses will appear here once your schedules are
          available.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-foreground">
            Scheduled medications
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {doses.length} medication dose{doses.length === 1 ? "" : "s"}
          </p>
        </div>

        <ClipboardList className="size-5 text-muted-foreground" />
      </div>

      <div className="grid gap-3">
        {doses.map((dose, index) => (
          <MedicationScheduleCard
            key={
              dose.doseScheduleId ??
              dose.scheduleId ??
              dose.id ??
              `${dose.medicineId ?? "dose"}-${index}`
            }
            dose={dose}
            timeZone={timeZone}
            disabled={isUpdating}
            onTaken={onTaken}
            onSkipped={onSkipped}
            onSnooze={onSnooze}
          />
        ))}
      </div>
    </section>
  );
}

export default TodayMedicationList;
