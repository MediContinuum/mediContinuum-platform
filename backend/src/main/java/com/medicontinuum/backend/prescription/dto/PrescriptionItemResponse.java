package com.medicontinuum.backend.prescription.dto;

import com.medicontinuum.backend.prescription.enums.PrescriptionFrequency;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record PrescriptionItemResponse(

    UUID id,

    UUID medicineId,

    String medicineName,

    String genericName,

    String strength,

    BigDecimal dosageAmount,

    String dosageUnit,

    PrescriptionFrequency frequency,

    LocalDate startDate,

    LocalDate endDate,

    String instructions
) {}