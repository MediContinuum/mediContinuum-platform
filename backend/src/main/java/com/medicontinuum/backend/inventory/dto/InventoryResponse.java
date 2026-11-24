package com.medicontinuum.backend.inventory.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record InventoryResponse(

    UUID inventoryItemId,

    UUID patientId,

    UUID medicineId,

    String medicineName,

    String genericName,

    String strength,

    String dosageForm,

    String stockUnit,

    BigDecimal availableQuantity,

    BigDecimal expiredQuantity,

    BigDecimal lowStockThreshold,

    boolean lowStock,

    LocalDateTime updatedAt,

    List<InventoryBatchResponse> batches
) {}