import api from "@/lib/axios";
import type {
  Doctor,
  DoctorId,
  CreateDoctorRequest,
  UpdateDoctorRequest,
} from "@/types/doctor.types";

export const doctorService = {
  create: async (data: CreateDoctorRequest): Promise<Doctor> => {
    const response = await api.post<Doctor>("/doctors", data);
    return response.data;
  },

  getAll: async (): Promise<Doctor[]> => {
    const response = await api.get<Doctor[]>("/doctors");
    return response.data;
  },

  getById: async (id: DoctorId): Promise<Doctor> => {
    const response = await api.get<Doctor>(`/doctors/${id}`);
    return response.data;
  },

  update: async (id: DoctorId, data: UpdateDoctorRequest): Promise<Doctor> => {
    const response = await api.put<Doctor>(`/doctors/${id}`, data);
    return response.data;
  },
};
