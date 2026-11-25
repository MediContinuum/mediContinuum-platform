package com.medicontinuum.backend.analytics.ml;

import java.math.BigDecimal;
import java.util.UUID;

public record MedicineThresholdPrediction(
    UUID stockItemId,
    UUID medicineId,
    String medicineName,
    String strength,
    String stockUnit,
    BigDecimal availableQuantity,
    BigDecimal configuredThreshold,
    BigDecimal recommendedThreshold,
    BigDecimal estimatedAverageDailyDemand,
    BigDecimal expectedLeadTimeDemand,
    BigDecimal safetyStock,
    Long estimatedDaysOfCover,
    int historyDays,
    int observedConsumptionDays,
    boolean modelTrained,
    String confidence,
    String riskLevel,
    String algorithm,
    String explanation
) {}
