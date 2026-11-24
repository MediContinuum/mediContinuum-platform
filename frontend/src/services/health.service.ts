import api from "@/lib/axios";

export interface HealthStatus {
  status: string;
  components?: Record<
    string,
    {
      status: string;
      details?: Record<string, unknown>;
    }
  >;
}

export const healthService = {
  check: async (): Promise<HealthStatus> => {
    const response = await api.get<HealthStatus>("/actuator/health");
    return response.data;
  },

  checkApplication: async (): Promise<HealthStatus> => {
    const response = await api.get<HealthStatus>("/health");
    return response.data;
  },
};
