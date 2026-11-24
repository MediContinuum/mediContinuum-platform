import api from "@/lib/axios";
import type {
  Patient,
  PatientId,
  CreatePatientRequest,
  UpdatePatientRequest,
} from "@/types/patient.types";

export const patientService = {
  create: async (data: CreatePatientRequest): Promise<Patient> => {
    const response = await api.post<Patient>("/patients", data);
    return response.data;
  },

  getAll: async (): Promise<Patient[]> => {
    const response = await api.get<Patient[]>("/patients");
    return response.data;
  },

  getById: async (patientId: PatientId): Promise<Patient> => {
    const response = await api.get<Patient>(`/patients/${patientId}`);
    return response.data;
  },

  getByGlobalId: async (globalUserId: string): Promise<Patient> => {
    const response = await api.get<Patient>(
      `/patients/global-id/${globalUserId}`,
    );
    return response.data;
  },

  update: async (
    patientId: PatientId,
    data: UpdatePatientRequest,
  ): Promise<Patient> => {
    const response = await api.put<Patient>(`/patients/${patientId}`, data);
    return response.data;
  },
};
