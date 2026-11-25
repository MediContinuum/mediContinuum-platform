package com.medicontinuum.backend.inventory.dto;

import java.math.BigDecimal;
import java.util.Map;

public record InventorySummaryResponse(
    long totalMedicineTypes,
    long lowStockMedicineTypes,
    BigDecimal totalAvailableQuantity,
    long expiringBatchCount,
    Map<String, BigDecimal> availableQuantityByUnit
) {}
