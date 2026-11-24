import api from "@/lib/axios";
import type {
  DashboardAnalytics,
  PatientAnalytics,
  InventoryAnalytics,
  AnalyticsDateRange,
} from "@/types/analytics.types";
import type {
  AnalyticsPeriod,
  AdherenceAnalyticsData,
  ConsumptionAnalytics,
  ForecastAnalyticsData,
  InventoryAnalyticsData as FeatureInventoryAnalyticsData,
  OrganisationAnalyticsData,
  PatientAnalyticsData as FeaturePatientAnalyticsData,
  ProcurementAnalyticsData,
} from "@/features/analytics/types/analytics.types";

/**
 * Frontend adapter for analytics REST endpoints.
 *
 * The server computes authoritative totals, rates, forecasts, and trends.
 * This module only sends the requested period and returns server response
 * data; visual formatting and chart rendering live under src/features.
 */

async function requestFeatureAnalytics<T>(
  endpoint: string,
  period: AnalyticsPeriod,
): Promise<T> {
  const response = await api.get<T>(`/analytics/${endpoint}`, {
    params: { period },
  });

  return response.data;
}

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

  /**
   * The following feature analytics methods are HTTP adapters only.
   * Calculation and aggregation must be implemented by the backend API.
   */
  getFeatureAdherence: (period: AnalyticsPeriod) =>
    requestFeatureAnalytics<AdherenceAnalyticsData>("adherence", period),

  getFeatureConsumption: (period: AnalyticsPeriod) =>
    requestFeatureAnalytics<ConsumptionAnalytics>("consumption", period),

  getFeatureForecast: (period: AnalyticsPeriod) =>
    requestFeatureAnalytics<ForecastAnalyticsData>("forecast", period),

  getFeatureInventory: (period: AnalyticsPeriod) =>
    requestFeatureAnalytics<FeatureInventoryAnalyticsData>("inventory", period),

  getFeatureOrganisation: (period: AnalyticsPeriod) =>
    requestFeatureAnalytics<OrganisationAnalyticsData>("organisation", period),

  getFeaturePatients: (period: AnalyticsPeriod) =>
    requestFeatureAnalytics<FeaturePatientAnalyticsData>("patients", period),

  getFeatureProcurement: (period: AnalyticsPeriod) =>
    requestFeatureAnalytics<ProcurementAnalyticsData>("procurement", period),
};
