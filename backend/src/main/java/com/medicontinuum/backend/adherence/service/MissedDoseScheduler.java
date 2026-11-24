package com.medicontinuum.backend.adherence.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class MissedDoseScheduler {

    private final AdherenceService adherenceService;

    @Scheduled(
        fixedDelayString = "${adherence.missed-check-delay-ms:60000}"
    )
    public void checkMissedDoses() {

        int updatedCount =
            adherenceService.markOverdueDosesAsMissed();

        if (updatedCount > 0) {
            log.info(
                "Marked {} overdue doses as MISSED",
                updatedCount
            );
        }
    }
}