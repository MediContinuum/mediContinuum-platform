export type DoctorId = string;

export interface Doctor {
  id: DoctorId;
  globalUserId?: string;
  registrationNumber?: string;
  specialization?: string;
  qualification?: string;
  experienceYears?: number;
  organisationId?: string;
  consultationFee?: number;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDoctorRequest {
  globalUserId: string;
  registrationNumber?: string;
  specialization?: string;
  qualification?: string;
  experienceYears?: number;
  organisationId?: string;
  consultationFee?: number;
  bio?: string;
}

export interface UpdateDoctorRequest {
  registrationNumber?: string;
  specialization?: string;
  qualification?: string;
  experienceYears?: number;
  organisationId?: string;
  consultationFee?: number;
  bio?: string;
}
