package com.medicontinuum.backend.analytics.ml;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

/**
 * Per-medicine demand model implemented in Java:
 * - EWMA level estimate for changing consumption,
 * - ordinary least-squares trend,
 * - residual standard deviation for lead-time safety stock.
 *
 * It is an explainable forecasting heuristic, not a medical dosage model.
 */
public class MedicineDemandModel {
    public static final String VERSION = "EWMA-LINEAR-SAFETY-STOCK-1";
    private static final int MIN_OBSERVED_DAYS = 10;
    private static final double EWMA_ALPHA = 0.25;

    public Result predict(
        List<BigDecimal> dailyConsumption,
        BigDecimal availableQuantity,
        BigDecimal configuredThreshold,
        int leadTimeDays,
        double serviceLevel
    ) {
        if (dailyConsumption == null || dailyConsumption.isEmpty()) {
            return insufficient(availableQuantity, configuredThreshold, leadTimeDays, 0);
        }

        double[] values = dailyConsumption.stream()
            .mapToDouble(value -> value == null ? 0.0 : Math.max(0.0, value.doubleValue()))
            .toArray();

        int observedDays = 0;
        double total = 0;
        for (double value : values) {
            if (value > 0) observedDays++;
            total += value;
        }

        if (observedDays < MIN_OBSERVED_DAYS || total <= 0) {
            return insufficient(availableQuantity, configuredThreshold, leadTimeDays, observedDays);
        }

        double ewma = values[0];
        for (int i = 1; i < values.length; i++) {
            ewma = EWMA_ALPHA * values[i] + (1.0 - EWMA_ALPHA) * ewma;
        }

        Regression regression = fitTrend(values);
        double residualStdDev = regression.residualStdDev();
        double dailyTrendEstimate = Math.max(0.0, regression.predict(values.length));
        double averageDailyDemand = Math.max(0.0, 0.45 * ewma + 0.55 * dailyTrendEstimate);

        double trendDemand = 0.0;
        for (int day = 0; day < leadTimeDays; day++) {
            trendDemand += Math.max(0.0, regression.predict(values.length + day));
        }
        double expectedLeadTimeDemand = Math.max(0.0,
            0.45 * ewma * leadTimeDays + 0.55 * trendDemand);

        double zScore = zScore(serviceLevel);
        double safetyStock = zScore * residualStdDev * Math.sqrt(leadTimeDays);
        BigDecimal calculatedThreshold = roundUp(expectedLeadTimeDemand + safetyStock);
        BigDecimal configured = safeNonNegative(configuredThreshold);
        BigDecimal recommended = calculatedThreshold.max(configured).setScale(2, RoundingMode.CEILING);
        BigDecimal available = safeNonNegative(availableQuantity);

        Long daysOfCover = averageDailyDemand <= 0
            ? null
            : Math.max(0L, (long) Math.floor(available.doubleValue() / averageDailyDemand));

        String confidence = observedDays >= 45 ? "HIGH" : observedDays >= 20 ? "MEDIUM" : "LOW";
        String risk = available.compareTo(recommended) <= 0
            ? "REORDER"
            : available.doubleValue() <= expectedLeadTimeDemand
                ? "AT_RISK"
                : "HEALTHY";

        return new Result(
            recommended,
            BigDecimal.valueOf(averageDailyDemand).setScale(3, RoundingMode.HALF_UP),
            BigDecimal.valueOf(expectedLeadTimeDemand).setScale(3, RoundingMode.HALF_UP),
            BigDecimal.valueOf(safetyStock).setScale(3, RoundingMode.HALF_UP),
            daysOfCover,
            observedDays,
            true,
            confidence,
            risk,
            "EWMA level 45% + linear-trend forecast 55%; safety stock uses "
                + serviceLevel + " target service level and residual demand variability."
        );
    }

    private Result insufficient(
        BigDecimal available,
        BigDecimal configured,
        int leadTimeDays,
        int observedDays
    ) {
        BigDecimal current = safeNonNegative(configured).setScale(2, RoundingMode.CEILING);
        return new Result(
            current,
            BigDecimal.ZERO,
            BigDecimal.ZERO,
            BigDecimal.ZERO,
            null,
            observedDays,
            false,
            "INSUFFICIENT_DATA",
            "INSUFFICIENT_DATA",
            "At least " + MIN_OBSERVED_DAYS
                + " days with recorded consumption are required. The configured threshold is retained."
        );
    }

    private Regression fitTrend(double[] values) {
        int n = values.length;
        double meanX = (n - 1) / 2.0;
        double meanY = 0.0;
        for (double value : values) meanY += value;
        meanY /= n;

        double numerator = 0.0;
        double denominator = 0.0;
        for (int i = 0; i < n; i++) {
            double dx = i - meanX;
            numerator += dx * (values[i] - meanY);
            denominator += dx * dx;
        }

        double slope = denominator == 0 ? 0.0 : numerator / denominator;
        double intercept = meanY - slope * meanX;
        double squaredError = 0.0;
        for (int i = 0; i < n; i++) {
            double residual = values[i] - (intercept + slope * i);
            squaredError += residual * residual;
        }
        double residualStdDev = Math.sqrt(squaredError / Math.max(1, n - 2));
        return new Regression(intercept, slope, residualStdDev);
    }

    private double zScore(double serviceLevel) {
        if (serviceLevel >= 0.99) return 2.326;
        if (serviceLevel >= 0.975) return 1.960;
        if (serviceLevel >= 0.95) return 1.645;
        if (serviceLevel >= 0.90) return 1.282;
        return 0.842; // 80% target
    }

    private BigDecimal roundUp(double value) {
        return BigDecimal.valueOf(Math.max(0.0, value)).setScale(2, RoundingMode.CEILING);
    }

    private BigDecimal safeNonNegative(BigDecimal value) {
        return value == null || value.signum() < 0 ? BigDecimal.ZERO : value;
    }

    private record Regression(double intercept, double slope, double residualStdDev) {
        double predict(double x) {
            return intercept + slope * x;
        }
    }

    public record Result(
        BigDecimal recommendedThreshold,
        BigDecimal averageDailyDemand,
        BigDecimal expectedLeadTimeDemand,
        BigDecimal safetyStock,
        Long estimatedDaysOfCover,
        int observedConsumptionDays,
        boolean modelTrained,
        String confidence,
        String riskLevel,
        String explanation
    ) {}
}
