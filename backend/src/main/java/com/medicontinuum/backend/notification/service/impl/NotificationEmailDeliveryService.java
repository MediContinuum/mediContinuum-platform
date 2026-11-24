package com.medicontinuum.backend.notification.service.impl;

import java.util.List;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.medicontinuum.backend.notification.service.EmailDeliveryPayload;
import com.medicontinuum.backend.notification.service.NotificationEmailSender;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Sends already-claimed email jobs outside a database transaction.
 */
@Service
@ConditionalOnProperty(
    prefix = "notification.email",
    name = "enabled",
    havingValue = "true"
)
@RequiredArgsConstructor
@Slf4j
public class NotificationEmailDeliveryService {

    private static final int DEFAULT_BATCH_SIZE = 50;

    private final NotificationEmailQueueService queueService;
    private final NotificationEmailSender notificationEmailSender;

    @Value("${notification.email.batch-size:50}")
    private int configuredBatchSize;

    public int deliverPendingEmails() {
        int batchSize = configuredBatchSize > 0
            ? Math.min(configuredBatchSize, 200)
            : DEFAULT_BATCH_SIZE;

        List<EmailDeliveryPayload> claimed = queueService.claimDueEmails(batchSize);

        for (EmailDeliveryPayload email : claimed) {
            try {
                notificationEmailSender.sendEmail(
                    email.recipientEmail(),
                    email.subject(),
                    email.message()
                );
            } catch (Exception exception) {
                queueService.markFailed(
                    email.notificationId(),
                    email.claimToken(),
                    exception.getMessage()
                );
                log.warn(
                    "Email delivery failed for notification {}",
                    email.notificationId(),
                    exception
                );
                continue;
            }

            queueService.markSent(email.notificationId(), email.claimToken());
        }

        return claimed.size();
    }
}
