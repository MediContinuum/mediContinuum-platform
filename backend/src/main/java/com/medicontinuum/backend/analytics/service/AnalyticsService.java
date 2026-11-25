package com.medicontinuum.backend.analytics.service;
import java.time.LocalDate;
import java.util.UUID;
import com.medicontinuum.backend.analytics.dto.AnalyticsResponses.*;
public interface AnalyticsService{
    DashboardAnalytics dashboard(String email,LocalDate fromDate,LocalDate toDate,UUID organisationId);
    PatientAnalytics patient(String email,UUID patientId,LocalDate fromDate,LocalDate toDate);
    InventoryAnalytics inventory(String email,String period,UUID organisationId);
    AdherenceAnalytics adherence(String email,String period);
    ConsumptionAnalytics consumption(String email,String period);
    ForecastAnalytics forecast(String email,String period);
    OrganisationAnalytics organisation(String email,String period,UUID organisationId);
    PatientAnalyticsData patients(String email,String period,UUID organisationId);
    ProcurementAnalytics procurement(String email,String period,UUID organisationId);
}
