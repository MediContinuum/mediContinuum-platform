package com.medicontinuum.backend.inventory.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class InventoryExpiryScheduler {

    private final InventoryService inventoryService;

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
}