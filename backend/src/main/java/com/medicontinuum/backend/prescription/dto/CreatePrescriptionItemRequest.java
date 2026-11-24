package com.medicontinuum.backend.prescription.dto;

import com.medicontinuum.backend.prescription.enums.PrescriptionFrequency;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record CreatePrescriptionItemRequest(

    @NotNull
    UUID medicineId,

    @NotNull
    @DecimalMin(value = "0.01")
    @Digits(integer = 6, fraction = 2)
    BigDecimal dosageAmount,

    @NotBlank
    @Size(max = 40)
    String dosageUnit,

    @NotNull
    PrescriptionFrequency frequency,

    @NotNull
    LocalDate startDate,

    @NotNull
    LocalDate endDate,

    @Size(max = 500)
    String instructions
) {}