package com.medicontinuum.backend.prescription.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.medicontinuum.backend.prescription.enums.PrescriptionStatus;

public record PrescriptionResponse(

    UUID id,

    UUID patientId,

    String patientGlobalUserId,

    String patientName,

    UUID prescribedByUserId,

    String prescribedByName,

    PrescriptionStatus status,

    String notes,

    LocalDateTime issuedAt,

    LocalDateTime createdAt,

    List<PrescriptionItemResponse> items
) {}