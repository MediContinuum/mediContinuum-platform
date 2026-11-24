export type MedicineId = string;

export type MedicineStatus = "ACTIVE" | "INACTIVE" | (string & {});

export interface Medicine {
  id: MedicineId;
  name: string;
  genericName?: string;
  brandName?: string;
  description?: string;
  manufacturer?: string;
  dosageForm?: string;
  strength?: string;
  status?: MedicineStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMedicineRequest {
  name: string;
  genericName?: string;
  brandName?: string;
  description?: string;
  manufacturer?: string;
  dosageForm?: string;
  strength?: string;
}

export interface UpdateMedicineRequest {
  name?: string;
  genericName?: string;
  brandName?: string;
  description?: string;
  manufacturer?: string;
  dosageForm?: string;
  strength?: string;
}

export interface UpdateMedicineStatusRequest {
  status: MedicineStatus;
}
