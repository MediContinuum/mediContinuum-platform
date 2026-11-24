import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { analyticsService } from "@/services/analytics.service";

import type {
  AnalyticsPeriod,
  InventoryAnalyticsData,
  OrganisationAnalyticsData,
  PatientAnalyticsData,
  ProcurementAnalyticsData,
} from "../types/analytics.types";

/**
 * Browser-side analytics hooks.
 *
 * These hooks own query keys, cache freshness, loading state, and the
 * user-selected reporting period. The backend owns aggregation, forecasting,
 * adherence calculations, stock valuation, and all authoritative metrics.
 * Network requests are delegated to src/services/analytics.service.ts.
 */

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

function useAnalyticsQuery<T>(
  key: string,
  period: AnalyticsPeriod,
  queryFn: () => Promise<T>,
) {
  return useQuery<T, Error>({
    queryKey: ["analytics", key, period],
    queryFn,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useAdherenceAnalytics(period: AnalyticsPeriod = "30d") {
  return useAnalyticsQuery(
    "adherence",
    period,
    () => analyticsService.getFeatureAdherence(period),
  );
}

export function useConsumptionAnalytics(period: AnalyticsPeriod = "30d") {
  return useAnalyticsQuery(
    "consumption",
    period,
    () => analyticsService.getFeatureConsumption(period),
  );
}

export function useForecastAnalytics(period: AnalyticsPeriod = "30d") {
  return useAnalyticsQuery(
    "forecast",
    period,
    () => analyticsService.getFeatureForecast(period),
  );
}

export function useInventoryAnalytics(period: AnalyticsPeriod = "30d") {
  return useAnalyticsQuery<InventoryAnalyticsData>(
    "inventory",
    period,
    () => analyticsService.getFeatureInventory(period),
  );
}

export function useOrganisationAnalytics(period: AnalyticsPeriod = "30d") {
  return useAnalyticsQuery<OrganisationAnalyticsData>(
    "organisation",
    period,
    () => analyticsService.getFeatureOrganisation(period),
  );
}

export function usePatientAnalytics(period: AnalyticsPeriod = "30d") {
  return useAnalyticsQuery<PatientAnalyticsData>(
    "patients",
    period,
    () => analyticsService.getFeaturePatients(period),
  );
}

export function useProcurementAnalytics(period: AnalyticsPeriod = "30d") {
  return useAnalyticsQuery<ProcurementAnalyticsData>(
    "procurement",
    period,
    () => analyticsService.getFeatureProcurement(period),
  );
}

