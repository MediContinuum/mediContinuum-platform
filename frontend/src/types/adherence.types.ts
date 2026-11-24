export type DoseScheduleId = string;

export type DoseStatus =
  "PENDING" | "TAKEN" | "SKIPPED" | "MISSED" | (string & {});

export interface GenerateScheduleRequest {
  prescriptionId: string;
  fromDate: string;
  toDate: string;
  timeZone: string;
}

export interface DoseSchedule {
  id: DoseScheduleId;
  prescriptionId: string;
  patientId?: string;
  medicineId?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  dosageAmount?: number;
  dosageUnit?: string;
  status: DoseStatus;
  takenAt?: string;
}

export interface UpdateDoseStatusRequest {
  status: DoseStatus;
}

export interface AdherenceSummary {
  totalDoses?: number;
  takenDoses?: number;
  skippedDoses?: number;
  missedDoses?: number;
  adherencePercentage?: number;
}

export interface AdherenceHistory {
  date: string;
  totalDoses?: number;
  takenDoses?: number;
  skippedDoses?: number;
  missedDoses?: number;
}
