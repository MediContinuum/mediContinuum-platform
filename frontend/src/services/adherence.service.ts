import api from "@/lib/axios";
import type {
  DoseSchedule,
  DoseScheduleId,
  GenerateScheduleRequest,
  UpdateDoseStatusRequest,
  AdherenceSummary,
} from "@/types/adherence.types";

export const adherenceService = {
  generateSchedules: async (data: GenerateScheduleRequest): Promise<void> => {
    await api.post("/adherence/schedules/generate", data);
  },

  getMySchedules: async (): Promise<DoseSchedule[]> => {
    const response = await api.get<DoseSchedule[]>("/adherence/me/schedules");
    return response.data;
  },

  getMySummary: async (): Promise<AdherenceSummary> => {
    const response = await api.get<AdherenceSummary>("/adherence/me/summary");
    return response.data;
  },

  getPatientSchedules: async (patientId: string): Promise<DoseSchedule[]> => {
    const response = await api.get<DoseSchedule[]>(
      `/adherence/patients/${patientId}/schedules`,
    );
    return response.data;
  },

  updateDoseStatus: async (
    doseScheduleId: DoseScheduleId,
    data: UpdateDoseStatusRequest,
  ): Promise<DoseSchedule> => {
    const response = await api.patch<DoseSchedule>(
      `/adherence/doses/${doseScheduleId}/status`,
      data,
    );
    return response.data;
  },
};
