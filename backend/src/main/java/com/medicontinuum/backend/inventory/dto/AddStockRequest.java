package com.medicontinuum.backend.inventory.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AddStockRequest(

    @NotNull
    UUID medicineId,

    @Size(max = 100)
    String batchNumber,

    @NotNull
    @FutureOrPresent
    LocalDate expiryDate,

    @NotNull
    @DecimalMin(value = "0.01")
    @Digits(integer = 10, fraction = 2)
    BigDecimal quantity,

    @NotBlank
    @Size(max = 40)
    String stockUnit,

    @DecimalMin(value = "0.00")
    @Digits(integer = 10, fraction = 2)
    BigDecimal lowStockThreshold,

    @Size(max = 500)
    String notes
) {}