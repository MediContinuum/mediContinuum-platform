import api from "@/lib/axios";
import type {
  Medicine,
  MedicineId,
  CreateMedicineRequest,
  UpdateMedicineRequest,
  UpdateMedicineStatusRequest,
} from "@/types/medicine.types";

export const medicineService = {
  create: async (data: CreateMedicineRequest): Promise<Medicine> => {
    const response = await api.post<Medicine>("/medicines", data);
    return response.data;
  },

  getAll: async (params?: {
    search?: string;
    page?: number;
    size?: number;
  }): Promise<Medicine[]> => {
    const response = await api.get<Medicine[]>("/medicines", { params });
    return response.data;
  },

  getById: async (id: MedicineId): Promise<Medicine> => {
    const response = await api.get<Medicine>(`/medicines/${id}`);
    return response.data;
  },

  update: async (
    id: MedicineId,
    data: UpdateMedicineRequest,
  ): Promise<Medicine> => {
    const response = await api.put<Medicine>(`/medicines/${id}`, data);
    return response.data;
  },

  updateStatus: async (
    id: MedicineId,
    data: UpdateMedicineStatusRequest,
  ): Promise<Medicine> => {
    const response = await api.patch<Medicine>(
      `/medicines/${id}/status`,
      null,
      { params: { status: data.status } },
    );
    return response.data;
  },
};
