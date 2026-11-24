package com.medicontinuum.backend.prescription.dto;

import com.medicontinuum.backend.prescription.enums.PrescriptionStatus;

import jakarta.validation.constraints.NotNull;

public record UpdatePrescriptionStatusRequest(

    @NotNull
    PrescriptionStatus status
) {}