export interface AnalyticsMetric {
  label: string;
  value: number;
  previousValue?: number;
  changePercentage?: number;
}

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface CategoryAnalytics {
  category: string;
  count: number;
  percentage?: number;
}

export interface DashboardAnalytics {
  metrics: AnalyticsMetric[];
  timeSeries?: TimeSeriesDataPoint[];
  categories?: CategoryAnalytics[];
}

export interface AnalyticsDateRange {
  fromDate: string;
  toDate: string;
}

export interface PatientAnalytics {
  patientId: string;
  metrics: AnalyticsMetric[];
  timeSeries?: TimeSeriesDataPoint[];
}

export interface InventoryAnalytics {
  totalItems?: number;
  lowStockItems?: number;
  expiringItems?: number;
  categories?: CategoryAnalytics[];
}
