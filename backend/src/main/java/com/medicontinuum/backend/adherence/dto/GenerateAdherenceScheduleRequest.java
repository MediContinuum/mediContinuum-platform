package com.medicontinuum.backend.adherence.dto;

import java.time.LocalDate;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record GenerateAdherenceScheduleRequest(

    @NotNull
    UUID prescriptionId,

    @NotNull
    LocalDate fromDate,

    @NotNull
    LocalDate toDate,

    @NotBlank
    @Size(max = 60)
    String timeZone
) {}