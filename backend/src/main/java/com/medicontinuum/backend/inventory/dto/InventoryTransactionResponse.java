package com.medicontinuum.backend.inventory.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.medicontinuum.backend.inventory.enums.InventoryTransactionType;

public record InventoryTransactionResponse(

    UUID transactionId,

    UUID inventoryItemId,

    UUID batchId,

    String batchNumber,

    InventoryTransactionType transactionType,

    BigDecimal quantity,

    String notes,

    String performedBy,

    LocalDateTime createdAt
) {}