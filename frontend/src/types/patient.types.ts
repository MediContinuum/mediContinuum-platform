export type PatientId = string;

export type Gender = "MALE" | "FEMALE" | "OTHER" | (string & {});

export type BloodGroup =
  | "A_POSITIVE"
  | "A_NEGATIVE"
  | "B_POSITIVE"
  | "B_NEGATIVE"
  | "AB_POSITIVE"
  | "AB_NEGATIVE"
  | "O_POSITIVE"
  | "O_NEGATIVE"
  | (string & {});

export interface Patient {
  id: PatientId;
  globalUserId: string;
  dateOfBirth: string;
  gender: Gender;
  bloodGroup: BloodGroup;
  addressLine: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePatientRequest {
  globalUserId: string;
  dateOfBirth: string;
  gender: Gender;
  bloodGroup: BloodGroup;
  addressLine: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

export type UpdatePatientRequest = Omit<CreatePatientRequest, "globalUserId">;
