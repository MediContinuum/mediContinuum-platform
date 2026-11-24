export type AnalyticsPeriod = "7d" | "30d" | "90d" | "12m";

export interface AnalyticsPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

export interface AnalyticsSummary {
  total: number;
  previousTotal: number;
  changePercent: number;
  subtitle?: string;
}

export interface ConsumptionAnalytics {
  points: AnalyticsPoint[];
  totalConsumed: number;
  averagePerDay: number;
}

export interface AdherenceAnalyticsData {
  adherenceRate: number;
  missedDoses: number;
  takenDoses: number;
  scheduledDoses: number;
  trend: AnalyticsPoint[];
}

export interface InventoryAnalyticsData {
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  expiringItems: number;
  stockValue: number;
  stockTrend: AnalyticsPoint[];
  categories: AnalyticsPoint[];
}

export interface ForecastAnalyticsData {
  points: Array<AnalyticsPoint & { forecast?: boolean }>;
  projectedDemand: number;
  projectedStockoutItems: number;
  horizonDays: number;
}

export interface OrganisationAnalyticsData {
  totalPatients: number;
  activePatients: number;
  totalDoctors: number;
  totalAppointments: number;
  appointmentsTrend: AnalyticsPoint[];
  patientGrowth: AnalyticsPoint[];
}

export interface PatientAnalyticsData {
  totalPatients: number;
  activePatients: number;
  newPatients: number;
  patientsByStatus: AnalyticsPoint[];
  patientGrowth: AnalyticsPoint[];
}

export interface ProcurementAnalyticsData {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalSpend: number;
  spendTrend: AnalyticsPoint[];
  ordersTrend: AnalyticsPoint[];
}

export interface AnalyticsResponse {
  adherence?: AdherenceAnalyticsData;
  consumption?: ConsumptionAnalytics;
  forecast?: ForecastAnalyticsData;
  inventory?: InventoryAnalyticsData;
  organisation?: OrganisationAnalyticsData;
  patients?: PatientAnalyticsData;
  procurement?: ProcurementAnalyticsData;
}

export interface AnalyticsQuery {
  period: AnalyticsPeriod;
  from?: string;
  to?: string;
}

export interface AnalyticsApiError {
  message: string;
}
