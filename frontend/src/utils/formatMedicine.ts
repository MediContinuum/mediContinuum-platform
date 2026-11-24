export type MedicineDosageUnit =
  | "TABLET"
  | "CAPSULE"
  | "ML"
  | "MG"
  | "G"
  | "DROP"
  | "PUFF"
  | "UNIT"
  | (string & {});

export type MedicineFrequency =
  | "ONCE_DAILY"
  | "TWICE_DAILY"
  | "THREE_TIMES_DAILY"
  | "FOUR_TIMES_DAILY"
  | "AS_NEEDED"
  | (string & {});

const DOSAGE_UNIT_LABELS: Record<string, string> = {
  TABLET: "tablet(s)",
  CAPSULE: "capsule(s)",
  ML: "mL",
  MG: "mg",
  G: "g",
  DROP: "drop(s)",
  PUFF: "puff(s)",
  UNIT: "unit(s)",
};

const FREQUENCY_LABELS: Record<string, string> = {
  ONCE_DAILY: "Once daily",
  TWICE_DAILY: "Twice daily",
  THREE_TIMES_DAILY: "Three times daily",
  FOUR_TIMES_DAILY: "Four times daily",
  AS_NEEDED: "As needed",
};

/**
 * Converts enum-style text into readable text.
 * Example: BLOOD_PRESSURE -> Blood Pressure.
 */
export function formatMedicineLabel(value?: string | null): string {
  if (!value) {
    return "—";
  }

  return value
    .toLowerCase()
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Formats dosage units.
 * Example: TABLET -> tablet(s).
 */
export function formatDosageUnit(unit?: MedicineDosageUnit | null): string {
  if (!unit) {
    return "";
  }

  return DOSAGE_UNIT_LABELS[unit.toUpperCase()] ?? formatMedicineLabel(unit);
}

/**
 * Formats dosage amount and unit.
 * Example: 1 + TABLET -> 1 tablet(s).
 */
export function formatDosage(
  amount?: number | null,
  unit?: MedicineDosageUnit | null,
): string {
  if (amount === null || amount === undefined || !Number.isFinite(amount)) {
    return "—";
  }

  const formattedAmount = new Intl.NumberFormat("en", {
    maximumFractionDigits: 2,
  }).format(amount);

  const formattedUnit = formatDosageUnit(unit);

  return formattedUnit
    ? `${formattedAmount} ${formattedUnit}`
    : formattedAmount;
}

/**
 * Formats prescription frequency.
 */
export function formatFrequency(frequency?: MedicineFrequency | null): string {
  if (!frequency) {
    return "—";
  }

  return (
    FREQUENCY_LABELS[frequency.toUpperCase()] ?? formatMedicineLabel(frequency)
  );
}

/**
 * Formats a complete medicine schedule.
 */
export function formatMedicineSchedule(params: {
  dosageAmount?: number | null;
  dosageUnit?: MedicineDosageUnit | null;
  frequency?: MedicineFrequency | null;
}): string {
  const dosage = formatDosage(params.dosageAmount, params.dosageUnit);

  const frequency = formatFrequency(params.frequency);

  if (dosage === "—") {
    return frequency;
  }

  if (frequency === "—") {
    return dosage;
  }

  return `${dosage} · ${frequency}`;
}

/**
 * Formats medicine instructions.
 */
export function formatMedicineInstructions(
  instructions?: string | null,
): string {
  const value = instructions?.trim();

  return value || "No special instructions";
}

/**
 * Formats stock quantity and unit.
 */
export function formatMedicineStock(
  quantity?: number | null,
  unit?: string | null,
): string {
  if (
    quantity === null ||
    quantity === undefined ||
    !Number.isFinite(quantity)
  ) {
    return "—";
  }

  const formattedQuantity = new Intl.NumberFormat("en", {
    maximumFractionDigits: 2,
  }).format(quantity);

  return unit
    ? `${formattedQuantity} ${formatMedicineLabel(unit)}`
    : formattedQuantity;
}
