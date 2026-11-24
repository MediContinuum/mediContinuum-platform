import { useQuery } from "@tanstack/react-query";
import type {
  AdherenceAnalyticsData,
  AnalyticsPeriod,
  ConsumptionAnalytics,
  ForecastAnalyticsData,
  InventoryAnalyticsData,
  OrganisationAnalyticsData,
  PatientAnalyticsData,
  ProcurementAnalyticsData,
} from "../types/analytics.types";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080").replace(/\/$/, "");

async function getAnalytics<T>(endpoint: string, period: AnalyticsPeriod): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}/api/analytics/${endpoint}?period=${encodeURIComponent(period)}`,
    {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    },
  );

  if (!response.ok) {
    let message = `Analytics request failed (${response.status}).`;
    try {
      const body = (await response.json()) as { message?: string; error?: string };
      message = body.message ?? body.error ?? message;
    } catch {
      // Keep the HTTP status message when the response is not JSON.
    }
    throw new Error(message);
  }

  return (await response.json()) as T;
}

import { useEffect, useState } from "react";

export function useAnalyticsPeriod(): AnalyticsPeriod {
  const [period, setPeriod] = useState<AnalyticsPeriod>("30d");
  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<AnalyticsPeriod>;
      if (["7d", "30d", "90d", "12m"].includes(customEvent.detail)) {
        setPeriod(customEvent.detail);
      }
    };
    window.addEventListener("analytics-period-change", handler);
    return () => window.removeEventListener("analytics-period-change", handler);
  }, []);
  return period;
}

function useAnalyticsQuery<T>(key: string, endpoint: string, period: AnalyticsPeriod) {
  return useQuery<T, Error>({
    queryKey: ["analytics", key, period],
    queryFn: () => getAnalytics<T>(endpoint, period),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useAdherenceAnalytics(period: AnalyticsPeriod = "30d") {
  return useAnalyticsQuery<AdherenceAnalyticsData>("adherence", "adherence", period);
}

export function useConsumptionAnalytics(period: AnalyticsPeriod = "30d") {
  return useAnalyticsQuery<ConsumptionAnalytics>("consumption", "consumption", period);
}

export function useForecastAnalytics(period: AnalyticsPeriod = "30d") {
  return useAnalyticsQuery<ForecastAnalyticsData>("forecast", "forecast", period);
}

export function useInventoryAnalytics(period: AnalyticsPeriod = "30d") {
  return useAnalyticsQuery<InventoryAnalyticsData>("inventory", "inventory", period);
}

export function useOrganisationAnalytics(period: AnalyticsPeriod = "30d") {
  return useAnalyticsQuery<OrganisationAnalyticsData>("organisation", "organisation", period);
}

export function usePatientAnalytics(period: AnalyticsPeriod = "30d") {
  return useAnalyticsQuery<PatientAnalyticsData>("patients", "patients", period);
}

export function useProcurementAnalytics(period: AnalyticsPeriod = "30d") {
  return useAnalyticsQuery<ProcurementAnalyticsData>("procurement", "procurement", period);
}
