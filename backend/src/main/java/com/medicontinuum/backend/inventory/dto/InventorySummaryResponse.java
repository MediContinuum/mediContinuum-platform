package com.medicontinuum.backend.inventory.dto;

import java.math.BigDecimal;

public record InventorySummaryResponse(

    long totalMedicineTypes,

    long lowStockMedicineTypes,

    BigDecimal totalAvailableQuantity,

    long expiringBatchCount

) {}