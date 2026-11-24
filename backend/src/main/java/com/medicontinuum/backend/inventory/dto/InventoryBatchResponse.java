package com.medicontinuum.backend.inventory.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record InventoryBatchResponse(

    UUID batchId,

    String batchNumber,

    LocalDate expiryDate,

    BigDecimal quantityReceived,

    BigDecimal quantityRemaining,

    String status,

    LocalDateTime receivedAt
) {}