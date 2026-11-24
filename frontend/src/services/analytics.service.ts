import api from "@/lib/axios";
import type {
  DashboardAnalytics,
  PatientAnalytics,
  InventoryAnalytics,
  AnalyticsDateRange,
} from "@/types/analytics.types";

export const analyticsService = {
  getDashboard: async (
    params?: AnalyticsDateRange,
  ): Promise<DashboardAnalytics> => {
    const response = await api.get<DashboardAnalytics>("/analytics/dashboard", {
      params,
    });
    return response.data;
  },

  getPatientAnalytics: async (
    patientId: string,
    params?: AnalyticsDateRange,
  ): Promise<PatientAnalytics> => {
    const response = await api.get<PatientAnalytics>(
      `/analytics/patients/${patientId}`,
      { params },
    );
    return response.data;
  },

  getInventoryAnalytics: async (
    params?: AnalyticsDateRange,
  ): Promise<InventoryAnalytics> => {
    const response = await api.get<InventoryAnalytics>("/analytics/inventory", {
      params,
    });
    return response.data;
  },
};
