package com.medicontinuum.backend.analytics.dto;
import java.util.List;
public final class AnalyticsResponses {
    private AnalyticsResponses(){}
    public record Metric(String label,double value,double previousValue,double changePercentage,String subtitle){}
    public record Point(String label,double value,double secondaryValue){}
    public record Category(String category,long count,double percentage){}
    public record CategoryPoint(String label,double value,double secondaryValue,String category,long count,double percentage){}
    public record DashboardAnalytics(List<Metric> metrics,List<Point> timeSeries,List<Category> categories){}
    public record PatientAnalytics(String patientId,List<Metric> metrics,List<Point> timeSeries){}
    public record InventoryAnalytics(int totalItems,int lowStockItems,int expiringItems,int outOfStockItems,double stockValue,boolean stockValueAvailable,List<Point> stockTrend,List<CategoryPoint> categories){}
    public record AdherenceAnalytics(double adherenceRate,long missedDoses,long takenDoses,long scheduledDoses,List<Point> trend){}
    public record ConsumptionAnalytics(List<Point> points,double totalConsumed,double averagePerDay){}
    public record ForecastAnalytics(List<Point> points,double projectedDemand,long projectedStockoutItems,boolean stockoutProjectionAvailable,int horizonDays){}
    public record OrganisationAnalytics(long totalPatients,long activePatients,long totalDoctors,long totalAppointments,List<Point> appointmentsTrend,List<Point> patientGrowth){}
    public record PatientAnalyticsData(long totalPatients,long activePatients,long newPatients,List<Point> patientsByStatus,List<Point> patientGrowth){}
    public record ProcurementAnalytics(long totalOrders,long pendingOrders,long completedOrders,double totalSpend,List<Point> spendTrend,List<Point> ordersTrend){}
}
