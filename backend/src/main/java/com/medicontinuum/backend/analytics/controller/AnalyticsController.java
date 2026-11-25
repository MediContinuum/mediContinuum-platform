package com.medicontinuum.backend.analytics.controller;

import java.time.LocalDate;
import java.util.UUID;
import com.medicontinuum.backend.analytics.dto.AnalyticsResponses.*;
import com.medicontinuum.backend.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/analytics") @RequiredArgsConstructor
public class AnalyticsController{
    private final AnalyticsService service;
    @GetMapping("/dashboard") @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DashboardAnalytics> dashboard(Authentication a,@RequestParam(required=false) @DateTimeFormat(iso=DateTimeFormat.ISO.DATE) LocalDate fromDate,@RequestParam(required=false) @DateTimeFormat(iso=DateTimeFormat.ISO.DATE) LocalDate toDate,@RequestParam(required=false) UUID organisationId){return ResponseEntity.ok(service.dashboard(a.getName(),fromDate,toDate,organisationId));}
    @GetMapping("/patients/{patientId}") @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PatientAnalytics> patient(Authentication a,@PathVariable UUID patientId,@RequestParam(required=false) @DateTimeFormat(iso=DateTimeFormat.ISO.DATE) LocalDate fromDate,@RequestParam(required=false) @DateTimeFormat(iso=DateTimeFormat.ISO.DATE) LocalDate toDate){return ResponseEntity.ok(service.patient(a.getName(),patientId,fromDate,toDate));}
    @GetMapping("/inventory") @PreAuthorize("isAuthenticated()")
    public ResponseEntity<InventoryAnalytics> inventory(Authentication a,@RequestParam(defaultValue="30d") String period,@RequestParam(required=false) UUID organisationId){return ResponseEntity.ok(service.inventory(a.getName(),period,organisationId));}
    @GetMapping("/adherence") @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AdherenceAnalytics> adherence(Authentication a,@RequestParam(defaultValue="30d") String period){return ResponseEntity.ok(service.adherence(a.getName(),period));}
    @GetMapping("/consumption") @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ConsumptionAnalytics> consumption(Authentication a,@RequestParam(defaultValue="30d") String period){return ResponseEntity.ok(service.consumption(a.getName(),period));}
    @GetMapping("/forecast") @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ForecastAnalytics> forecast(Authentication a,@RequestParam(defaultValue="30d") String period){return ResponseEntity.ok(service.forecast(a.getName(),period));}
    @GetMapping("/organisation") @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrganisationAnalytics> organisation(Authentication a,@RequestParam(defaultValue="30d") String period,@RequestParam(required=false) UUID organisationId){return ResponseEntity.ok(service.organisation(a.getName(),period,organisationId));}
    @GetMapping("/patients") @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PatientAnalyticsData> patients(Authentication a,@RequestParam(defaultValue="30d") String period,@RequestParam(required=false) UUID organisationId){return ResponseEntity.ok(service.patients(a.getName(),period,organisationId));}
    @GetMapping("/procurement") @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ProcurementAnalytics> procurement(Authentication a,@RequestParam(defaultValue="30d") String period,@RequestParam(required=false) UUID organisationId){return ResponseEntity.ok(service.procurement(a.getName(),period,organisationId));}
}
