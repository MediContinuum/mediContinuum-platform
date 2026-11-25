package com.medicontinuum.backend.analytics.controller;

import java.time.LocalDate;
import java.util.UUID;
import com.medicontinuum.backend.analytics.dto.AnalyticsResponses.*;
import com.medicontinuum.backend.analytics.ml.MedicineThresholdPredictionResponse;
import com.medicontinuum.backend.analytics.ml.MedicineThresholdPredictionService;
import com.medicontinuum.backend.analytics.service.AnalyticsService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {
    private final AnalyticsService service;
    private final MedicineThresholdPredictionService thresholdPredictionService;

    @GetMapping("/dashboard")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DashboardAnalytics> dashboard(
        Authentication authentication,
        @RequestParam(required=false) @DateTimeFormat(iso=DateTimeFormat.ISO.DATE) LocalDate fromDate,
        @RequestParam(required=false) @DateTimeFormat(iso=DateTimeFormat.ISO.DATE) LocalDate toDate,
        @RequestParam(required=false) UUID organisationId
    ) {
        return ResponseEntity.ok(service.dashboard(authentication.getName(), fromDate, toDate, organisationId));
    }

    @GetMapping("/patients/{patientId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PatientAnalytics> patient(
        Authentication authentication,
        @PathVariable UUID patientId,
        @RequestParam(required=false) @DateTimeFormat(iso=DateTimeFormat.ISO.DATE) LocalDate fromDate,
        @RequestParam(required=false) @DateTimeFormat(iso=DateTimeFormat.ISO.DATE) LocalDate toDate
    ) {
        return ResponseEntity.ok(service.patient(authentication.getName(), patientId, fromDate, toDate));
    }

    @GetMapping("/inventory")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<InventoryAnalytics> inventory(
        Authentication authentication,
        @RequestParam(defaultValue="30d") String period,
        @RequestParam(required=false) UUID organisationId
    ) {
        return ResponseEntity.ok(service.inventory(authentication.getName(), period, organisationId));
    }

    @GetMapping("/adherence")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AdherenceAnalytics> adherence(Authentication authentication,
        @RequestParam(defaultValue="30d") String period) {
        return ResponseEntity.ok(service.adherence(authentication.getName(), period));
    }

    @GetMapping("/consumption")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ConsumptionAnalytics> consumption(Authentication authentication,
        @RequestParam(defaultValue="30d") String period) {
        return ResponseEntity.ok(service.consumption(authentication.getName(), period));
    }

    @GetMapping("/forecast")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ForecastAnalytics> forecast(Authentication authentication,
        @RequestParam(defaultValue="30d") String period) {
        return ResponseEntity.ok(service.forecast(authentication.getName(), period));
    }

    @GetMapping("/organisation")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrganisationAnalytics> organisation(Authentication authentication,
        @RequestParam(defaultValue="30d") String period,
        @RequestParam(required=false) UUID organisationId) {
        return ResponseEntity.ok(service.organisation(authentication.getName(), period, organisationId));
    }

    @GetMapping("/patients")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PatientAnalyticsData> patients(Authentication authentication,
        @RequestParam(defaultValue="30d") String period,
        @RequestParam(required=false) UUID organisationId) {
        return ResponseEntity.ok(service.patients(authentication.getName(), period, organisationId));
    }

    @GetMapping("/procurement")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ProcurementAnalytics> procurement(Authentication authentication,
        @RequestParam(defaultValue="30d") String period,
        @RequestParam(required=false) UUID organisationId) {
        return ResponseEntity.ok(service.procurement(authentication.getName(), period, organisationId));
    }

    @GetMapping("/medicine-thresholds")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MedicineThresholdPredictionResponse> medicineThresholds(
        Authentication authentication,
        @RequestParam(required=false) UUID organisationId,
        @RequestParam(defaultValue="90") @Min(30) @Max(180) int historyDays,
        @RequestParam(defaultValue="7") @Min(1) @Max(90) int leadTimeDays,
        @RequestParam(defaultValue="0.95") double serviceLevel
    ) {
        return ResponseEntity.ok(thresholdPredictionService.predict(
            authentication.getName(), organisationId, historyDays, leadTimeDays, serviceLevel
        ));
    }
}
