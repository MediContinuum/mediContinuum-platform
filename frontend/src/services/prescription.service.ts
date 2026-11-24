import api from "@/lib/axios";
import type {
  Prescription,
  PrescriptionId,
  CreatePrescriptionRequest,
  UpdatePrescriptionStatusRequest,
} from "@/types/prescription.types";

export const prescriptionService = {
  create: async (data: CreatePrescriptionRequest): Promise<Prescription> => {
    const response = await api.post<Prescription>("/prescriptions", data);
    return response.data;
  },

  getById: async (id: PrescriptionId): Promise<Prescription> => {
    const response = await api.get<Prescription>(`/prescriptions/${id}`);
    return response.data;
  },

  getByPatient: async (
    patientId: string,
    status?: string,
  ): Promise<Prescription[]> => {
    const response = await api.get<Prescription[]>(
      `/prescriptions/patient/${patientId}`,
      { params: status ? { status } : undefined },
    );
    return response.data;
  },

  getMyIssued: async (): Promise<Prescription[]> => {
    const response = await api.get<Prescription[]>("/prescriptions/my-issued");
    return response.data;
  },

  updateStatus: async (
    id: PrescriptionId,
    data: UpdatePrescriptionStatusRequest,
  ): Promise<Prescription> => {
    const response = await api.patch<Prescription>(
      `/prescriptions/${id}/status`,
      data,
    );
    return response.data;
  },
};
