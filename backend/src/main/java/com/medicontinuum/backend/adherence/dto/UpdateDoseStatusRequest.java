package com.medicontinuum.backend.adherence.dto;

import com.medicontinuum.backend.adherence.enums.DoseStatus;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateDoseStatusRequest(

    @NotNull
    DoseStatus status,

    @Size(max = 500)
    String patientNote
) {}