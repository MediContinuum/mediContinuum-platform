export type AdherenceStatus =
  | "PENDING"
  | "SCHEDULED"
  | "TAKEN"
  | "MISSED"
  | "SKIPPED"
  | "SNOOZED"
  | (string & {});

export interface MedicationDose {
  id?: string;
  doseScheduleId?: string;
  scheduleId?: string;

  prescriptionId?: string;
  medicineId?: string;

  medicineName?: string;
  medicationName?: string;
  name?: string;

  dosageAmount?: number | string;
  dosageUnit?: string;

  scheduledAt?: string;
  scheduledDate?: string;
  scheduledTime?: string;

  timeZone?: string;

  status?: AdherenceStatus;

  instructions?: string;
  notes?: string;

  takenAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdherenceSummaryView {
  totalDoses?: number;
  takenDoses?: number;
  missedDoses?: number;
  skippedDoses?: number;
  pendingDoses?: number;

  adherencePercentage?: number;
  completionRate?: number;

  startDate?: string;
  endDate?: string;
}

export interface DoseStatusUpdate {
  doseScheduleId: string;
  status: "TAKEN" | "SKIPPED";
}

export interface SnoozeOption {
  label: string;
  minutes: number;
}

export interface AdherencePageState {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

/* -------------------------------------------------------------------------- */
/* DOSE HELPERS                                                                */
/* -------------------------------------------------------------------------- */

export function getDoseId(dose: MedicationDose): string {
  return dose.doseScheduleId ?? dose.scheduleId ?? dose.id ?? "";
}

export function getDoseMedicineName(dose: MedicationDose): string {
  return dose.medicineName ?? dose.medicationName ?? dose.name ?? "Medication";
}

export function getDoseStatus(dose: MedicationDose): AdherenceStatus {
  return (dose.status ?? "PENDING").toUpperCase() as AdherenceStatus;
}

export function getDoseDateKey(
  dose: MedicationDose,
  timeZone?: string,
): string {
  if (dose.scheduledDate) {
    return dose.scheduledDate.slice(0, 10);
  }

  if (!dose.scheduledAt) {
    return "";
  }

  const date = new Date(dose.scheduledAt);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const zone =
    timeZone ||
    dose.timeZone ||
    Intl.DateTimeFormat().resolvedOptions().timeZone ||
    "UTC";

  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: zone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date);

    const values = Object.fromEntries(
      parts.map((part) => [part.type, part.value]),
    );

    return `${values.year}-${values.month}-${values.day}`;
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

export function getDoseDisplayTime(
  dose: MedicationDose,
  timeZone?: string,
): string {
  if (dose.scheduledTime) {
    return dose.scheduledTime;
  }

  if (!dose.scheduledAt) {
    return "Time not specified";
  }

  const date = new Date(dose.scheduledAt);

  if (Number.isNaN(date.getTime())) {
    return "Time not specified";
  }

  const zone =
    timeZone ||
    dose.timeZone ||
    Intl.DateTimeFormat().resolvedOptions().timeZone ||
    "UTC";

  try {
    return new Intl.DateTimeFormat("en-IN", {
      timeZone: zone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  } catch {
    return date.toLocaleTimeString();
  }
}

export function getDoseDosage(dose: MedicationDose): string {
  if (dose.dosageAmount === null || dose.dosageAmount === undefined) {
    return "Dosage not specified";
  }

  const unit = dose.dosageUnit ?? "";

  return `${dose.dosageAmount} ${unit}`.trim();
}

export function getDoseStatusLabel(status: AdherenceStatus): string {
  const labels: Record<string, string> = {
    PENDING: "Pending",
    SCHEDULED: "Scheduled",
    TAKEN: "Taken",
    MISSED: "Missed",
    SKIPPED: "Skipped",
    SNOOZED: "Snoozed",
  };

  return (
    labels[status] ??
    status
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
  );
}

export function getDoseStatusClass(status: AdherenceStatus): string {
  const classes: Record<string, string> = {
    TAKEN: "bg-emerald-50 text-emerald-700 border-emerald-200",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    SCHEDULED: "bg-sky-50 text-sky-700 border-sky-200",
    MISSED: "bg-rose-50 text-rose-700 border-rose-200",
    SKIPPED: "bg-slate-100 text-slate-600 border-slate-200",
    SNOOZED: "bg-violet-50 text-violet-700 border-violet-200",
  };

  return classes[status] ?? "bg-muted text-muted-foreground border-border";
}
