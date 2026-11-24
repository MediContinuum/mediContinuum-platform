import api from "@/lib/axios";
import type {
  Appointment,
  AppointmentId,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  UpdateAppointmentStatusRequest,
} from "@/types/appointment.types";

export const appointmentService = {
  create: async (data: CreateAppointmentRequest): Promise<Appointment> => {
    const response = await api.post<Appointment>("/appointments", data);
    return response.data;
  },

  getAll: async (params?: {
    patientId?: string;
    doctorId?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
  }): Promise<Appointment[]> => {
    const response = await api.get<Appointment[]>("/appointments", {
      params,
    });
    return response.data;
  },

  getById: async (id: AppointmentId): Promise<Appointment> => {
    const response = await api.get<Appointment>(`/appointments/${id}`);
    return response.data;
  },

  update: async (
    id: AppointmentId,
    data: UpdateAppointmentRequest,
  ): Promise<Appointment> => {
    const response = await api.put<Appointment>(`/appointments/${id}`, data);
    return response.data;
  },

  updateStatus: async (
    id: AppointmentId,
    data: UpdateAppointmentStatusRequest,
  ): Promise<Appointment> => {
    const response = await api.patch<Appointment>(
      `/appointments/${id}/status`,
      data,
    );
    return response.data;
  },

  cancel: async (id: AppointmentId): Promise<void> => {
    await api.patch(`/appointments/${id}/cancel`);
  },
};
