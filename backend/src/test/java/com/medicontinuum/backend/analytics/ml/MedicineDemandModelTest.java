package com.medicontinuum.backend.analytics.ml;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;

class MedicineDemandModelTest {
    private final MedicineDemandModel model = new MedicineDemandModel();

    @Test
    void insufficientHistoryKeepsConfiguredThreshold() {
        List<BigDecimal> demand = new ArrayList<>();
        for (int i = 0; i < 30; i++) demand.add(BigDecimal.ZERO);
        demand.set(0, BigDecimal.ONE);
        demand.set(10, BigDecimal.ONE);

        MedicineDemandModel.Result result = model.predict(
            demand, new BigDecimal("12"), new BigDecimal("5"), 7, 0.95
        );

        assertFalse(result.modelTrained());
        assertEquals("INSUFFICIENT_DATA", result.confidence());
        assertEquals(new BigDecimal("5.00"), result.recommendedThreshold());
    }

    @Test
    void highConsumptionProducesMedicineSpecificLeadTimeThreshold() {
        List<BigDecimal> demand = new ArrayList<>();
        for (int i = 0; i < 60; i++) demand.add(new BigDecimal("2.00"));

        MedicineDemandModel.Result result = model.predict(
            demand, new BigDecimal("40"), new BigDecimal("5"), 7, 0.95
        );

        assertTrue(result.modelTrained());
        assertEquals("HIGH", result.confidence());
        assertTrue(result.recommendedThreshold().compareTo(new BigDecimal("14.00")) >= 0);
        assertNotNull(result.estimatedDaysOfCover());
    }

    @Test
    void risingDemandIncreasesForecastComparedWithFlatDemand() {
        List<BigDecimal> flat = new ArrayList<>();
        List<BigDecimal> rising = new ArrayList<>();
        for (int i = 0; i < 60; i++) {
            flat.add(new BigDecimal("1.00"));
            rising.add(BigDecimal.valueOf(0.5 + i * 0.05));
        }

        MedicineDemandModel.Result flatResult = model.predict(
            flat, new BigDecimal("100"), BigDecimal.ZERO, 14, 0.95
        );
        MedicineDemandModel.Result risingResult = model.predict(
            rising, new BigDecimal("100"), BigDecimal.ZERO, 14, 0.95
        );

        assertTrue(risingResult.expectedLeadTimeDemand().compareTo(flatResult.expectedLeadTimeDemand()) > 0);
    }

    @Test
    void higherServiceLevelDoesNotReduceSafetyStock() {
        List<BigDecimal> variable = new ArrayList<>();
        for (int i = 0; i < 60; i++) variable.add(BigDecimal.valueOf(i % 4 + 1));

        MedicineDemandModel.Result standard = model.predict(
            variable, BigDecimal.TEN, BigDecimal.ZERO, 7, 0.90
        );
        MedicineDemandModel.Result cautious = model.predict(
            variable, BigDecimal.TEN, BigDecimal.ZERO, 7, 0.99
        );

        assertTrue(cautious.safetyStock().compareTo(standard.safetyStock()) >= 0);
    }
}
