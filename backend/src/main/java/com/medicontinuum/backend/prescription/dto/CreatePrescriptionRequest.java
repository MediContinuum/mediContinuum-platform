package com.medicontinuum.backend.prescription.dto;

import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreatePrescriptionRequest(

    @NotNull
    UUID patientId,

    @Size(max = 1000)
    String notes,

    @NotEmpty
    @Size(max = 30)
    List<@Valid CreatePrescriptionItemRequest> items
) {}