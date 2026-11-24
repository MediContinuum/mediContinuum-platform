package com.medicontinuum.backend.adherence.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record AdherenceSummaryResponse(

    LocalDate fromDate,

    LocalDate toDate,

    long totalDoses,

    long takenDoses,

    long skippedDoses,

    long missedDoses,

    long pendingDoses,

    BigDecimal adherencePercentage
) {}