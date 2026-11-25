package com.medicontinuum.backend.analytics.ml;

import java.util.List;

public record MedicineThresholdPredictionResponse(
    String scope,
    int historyDays,
    int leadTimeDays,
    double targetServiceLevel,
    String modelVersion,
    List<MedicineThresholdPrediction> predictions
) {}
