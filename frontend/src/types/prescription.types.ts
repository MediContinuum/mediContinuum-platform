export type PrescriptionId = string;

export type DosageUnit =
  | "TABLET"
  | "CAPSULE"
  | "ML"
  | "MG"
  | "G"
  | "DROP"
  | "PUFF"
  | "UNIT"
  | (string & {});

export type DosageFrequency =
  | "ONCE_DAILY"
  | "TWICE_DAILY"
  | "THREE_TIMES_DAILY"
  | "FOUR_TIMES_DAILY"
  | "AS_NEEDED"
  | (string & {});

export type PrescriptionStatus =
  "ACTIVE" | "COMPLETED" | "CANCELLED" | (string & {});

export interface PrescriptionItemRequest {
  medicineId: string;
  dosageAmount: number;
  dosageUnit: DosageUnit;
  frequency: DosageFrequency;
  startDate: string;
  endDate: string;
  instructions?: string;
}

export interface CreatePrescriptionRequest {
  patientId: string;
  notes?: string;
  items: PrescriptionItemRequest[];
}

export interface PrescriptionItem {
  id: string;
  medicineId: string;
  dosageAmount: number;
  dosageUnit: DosageUnit;
  frequency: DosageFrequency;
  startDate: string;
  endDate: string;
  instructions?: string;
}

export interface Prescription {
  id: PrescriptionId;
  patientId: string;
  doctorId?: string;
  notes?: string;
  status: PrescriptionStatus;
  items: PrescriptionItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdatePrescriptionStatusRequest {
  status: PrescriptionStatus;
}
