package com.medicontinuum.backend.inventory.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class InventoryExpiryScheduler {

    private final InventoryService inventoryService;

    @Value("${inventory.expiry-warning-days:30}")
    private int expiryWarningDays;

    @Scheduled(
        fixedDelayString = "${inventory.expiry-check-delay-ms:3600000}"
    )
    public void processExpiredBatches() {

        int count = inventoryService.expireOldBatches();

        if (count > 0) {
            log.info(
                "Processed {} expired medicine batches",
                count
            );
        }
    }

    @Scheduled(
        cron = "${inventory.expiry-warning-cron:0 0 9 * * *}",
        zone = "${app.time-zone:Asia/Kolkata}"
    )
    public void notifyExpiringBatches() {

        int count = inventoryService.notifyExpiringBatches(
            expiryWarningDays
        );

        if (count > 0) {
            log.info(
                "Created {} medicine expiry notification(s)",
                count
            );
        }
    }
}