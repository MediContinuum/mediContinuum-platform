package com.medicontinuum.backend.adherence.service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import com.medicontinuum.backend.adherence.dto.AdherenceSummaryResponse;
import com.medicontinuum.backend.adherence.dto.DoseScheduleResponse;
import com.medicontinuum.backend.adherence.dto.GenerateAdherenceScheduleRequest;
import com.medicontinuum.backend.adherence.dto.ScheduleGenerationResponse;
import com.medicontinuum.backend.adherence.enums.DoseStatus;

public interface AdherenceService {

    ScheduleGenerationResponse generateSchedules(
        String currentUserEmail,
        boolean platformAdmin,
        GenerateAdherenceScheduleRequest request
    );

    List<DoseScheduleResponse> getMySchedules(
        String currentUserEmail,
        LocalDate fromDate,
        LocalDate toDate,
        String timeZone
    );

    AdherenceSummaryResponse getMySummary(
        String currentUserEmail,
        LocalDate fromDate,
        LocalDate toDate,
        String timeZone
    );

    List<DoseScheduleResponse> getPatientSchedules(
        UUID patientId,
        LocalDate fromDate,
        LocalDate toDate,
        String timeZone
    );

    DoseScheduleResponse updateDoseStatus(
        String currentUserEmail,
        UUID doseScheduleId,
        DoseStatus status,
        String patientNote
    );

    int markOverdueDosesAsMissed();

    int cancelPendingSchedules(UUID prescriptionId);
}