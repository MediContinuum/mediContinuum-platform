package com.medicontinuum.backend.adherence.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

import com.medicontinuum.backend.adherence.enums.DoseStatus;

public record DoseScheduleResponse(

    UUID id,

    UUID prescriptionId,

    UUID prescriptionItemId,

    UUID medicineId,

    String medicineName,

    String genericName,

    String strength,

    String dosageAmount,

    String dosageUnit,

    String frequency,

    OffsetDateTime scheduledAt,

    DoseStatus status,

    OffsetDateTime takenAt,

    String patientNote
) {}