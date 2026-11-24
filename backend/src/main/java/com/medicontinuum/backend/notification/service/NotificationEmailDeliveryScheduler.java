package com.medicontinuum.backend.notification.service;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.medicontinuum.backend.notification.service.impl.NotificationEmailDeliveryService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
@ConditionalOnProperty(
        prefix = "notification.email",
        name = "enabled",
        havingValue = "true"
)
public class NotificationEmailDeliveryScheduler {

    private final NotificationEmailDeliveryService deliveryService;

    @Scheduled(
            fixedDelayString = "${notification.email.delivery-delay-ms:30000}"
    )
    public void deliverPendingEmails() {

        int processed = deliveryService.deliverPendingEmails();

        if (processed > 0) {
            log.info("Processed {} pending email notification(s)", processed);
        }
    }
}
