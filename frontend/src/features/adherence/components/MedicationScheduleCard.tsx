import { CalendarClock, Clock3, Pill, StickyNote } from "lucide-react";

import {
  getDoseDateKey,
  getDoseDisplayTime,
  getDoseDosage,
  getDoseMedicineName,
  getDoseStatus,
  getDoseStatusClass,
  getDoseStatusLabel,
  type MedicationDose,
} from "../types/adherence.types";

import DoseActionButtons from "./DoseActionButtons";

interface MedicationScheduleCardProps {
  dose: MedicationDose;
  timeZone?: string;
  onTaken?: (id: string) => void;
  onSkipped?: (id: string) => void;
  onSnooze?: (dose: MedicationDose) => void;
  disabled?: boolean;
  showDate?: boolean;
}

/**
 * Displays one dose record returned by the adherence API.
 * Visible actions are UI affordances only; the backend validates permissions
 * and every requested dose-status transition.
 */
function MedicationScheduleCard({
  dose,
  timeZone,
  onTaken,
  onSkipped,
  onSnooze,
  disabled = false,
  showDate = true,
}: MedicationScheduleCardProps) {
  const id = dose.doseScheduleId ?? dose.scheduleId ?? dose.id ?? "";

  const status = getDoseStatus(dose);

  // This controls visible UI actions only. The backend must validate every
  // requested transition; unknown or unrecognised statuses get no actions.
  const canUpdate = ["PENDING", "SCHEDULED", "SNOOZED"].includes(status);

  return (
    <article className="rounded-xl border border-border bg-card p-4 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#E5F3F4] text-[#087E8B]">
            <Pill className="size-5" />
          </div>

          <div className="min-w-0">
            <h3 className="truncate font-semibold text-foreground">
              {getDoseMedicineName(dose)}
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              {getDoseDosage(dose)}
            </p>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
              {showDate && (
                <span className="flex items-center gap-1.5">
                  <CalendarClock className="size-3.5" />
                  {getDoseDateKey(dose, timeZone) || "Date not specified"}
                </span>
              )}

              <span className="flex items-center gap-1.5">
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
      </div>

      {dose.instructions && (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-muted/60 p-3 text-sm text-muted-foreground">
          <StickyNote className="mt-0.5 size-4 shrink-0" />
          <p>{dose.instructions}</p>
        </div>
      )}

      {canUpdate && (onTaken || onSkipped || onSnooze) && (
        <div className="mt-4 border-t border-border pt-4">
          <DoseActionButtons
            onTaken={onTaken ? () => onTaken(id) : undefined}
            onSkipped={onSkipped ? () => onSkipped(id) : undefined}
            onSnooze={onSnooze ? () => onSnooze(dose) : undefined}
            disabled={disabled || !id}
          />
        </div>
      )}
    </article>
  );
}

export default MedicationScheduleCard;
