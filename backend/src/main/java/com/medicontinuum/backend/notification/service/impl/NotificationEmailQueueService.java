package com.medicontinuum.backend.notification.service.impl;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.medicontinuum.backend.notification.entity.Notification;
import com.medicontinuum.backend.notification.enums.EmailDeliveryStatus;
import com.medicontinuum.backend.notification.repository.NotificationRepository;
import com.medicontinuum.backend.notification.service.EmailDeliveryPayload;

import lombok.RequiredArgsConstructor;

/**
 * Owns short database transactions for claiming and completing email jobs.
 * SMTP is deliberately never called from this bean.
 */
@Service
@RequiredArgsConstructor
public class NotificationEmailQueueService {

    private final NotificationRepository notificationRepository;

    @Value("${notification.email.max-attempts:5}")
    private int maxAttempts;

    @Value("${notification.email.processing-timeout-minutes:15}")
    private int processingTimeoutMinutes;

    @Value("${app.time-zone:Asia/Kolkata}")
    private String appTimeZone;

    @Transactional
    public List<EmailDeliveryPayload> claimDueEmails(int requestedLimit) {
        int limit = Math.max(1, Math.min(requestedLimit, 200));
        LocalDateTime now = now();

        notificationRepository.requeueStaleEmailDeliveries(
            EmailDeliveryStatus.PROCESSING,
            EmailDeliveryStatus.PENDING,
            now,
            now.minusMinutes(Math.max(1, processingTimeoutMinutes))
        );

        List<Notification> due = notificationRepository.findDueEmailNotificationsForUpdate(
            EmailDeliveryStatus.PENDING.name(),
            now,
            limit
        );

        for (Notification notification : due) {
            notification.setEmailDeliveryStatus(EmailDeliveryStatus.PROCESSING);
            notification.setEmailProcessingStartedAt(now);
            notification.setEmailProcessingToken(UUID.randomUUID());
            notification.setEmailAttemptCount(notification.getEmailAttemptCount() + 1);
        }

        notificationRepository.saveAll(due);

        return due.stream()
            .map(notification -> new EmailDeliveryPayload(
                notification.getId(),
                notification.getEmailProcessingToken(),
                notification.getRecipient().getEmail(),
                notification.getTitle(),
                notification.getMessage()
            ))
            .toList();
    }

    @Transactional
    public void markSent(UUID notificationId, UUID claimToken) {
        Notification notification = findClaimedNotification(notificationId, claimToken);
        if (notification == null) {
            return;
        }

        notification.setEmailDeliveryStatus(EmailDeliveryStatus.SENT);
        notification.setEmailSentAt(now());
        notification.setEmailFailureReason(null);
        notification.setEmailNextAttemptAt(null);
        clearClaim(notification);
    }

    @Transactional
    public void markFailed(UUID notificationId, UUID claimToken, String failureReason) {
        Notification notification = findClaimedNotification(notificationId, claimToken);
        if (notification == null) {
            return;
        }

        String reason = failureReason;
        if (reason == null || reason.isBlank()) {
            reason = "Email delivery failed";
        }
        if (reason.length() > 500) {
            reason = reason.substring(0, 500);
        }
        notification.setEmailFailureReason(reason);

        int attempts = notification.getEmailAttemptCount();
        int allowedAttempts = Math.max(1, maxAttempts);

        if (attempts >= allowedAttempts) {
            notification.setEmailDeliveryStatus(EmailDeliveryStatus.FAILED);
            notification.setEmailNextAttemptAt(null);
        } else {
            long retryDelayMinutes = Math.min(60L, 1L << Math.min(attempts - 1, 6));
            notification.setEmailDeliveryStatus(EmailDeliveryStatus.PENDING);
            notification.setEmailNextAttemptAt(now().plusMinutes(retryDelayMinutes));
        }

        clearClaim(notification);
    }

    private Notification findClaimedNotification(UUID notificationId, UUID claimToken) {
        Notification notification = notificationRepository.findById(notificationId)
            .orElse(null);

        if (notification == null
                || notification.getEmailDeliveryStatus() != EmailDeliveryStatus.PROCESSING
                || !Objects.equals(notification.getEmailProcessingToken(), claimToken)) {
            return null;
        }

        return notification;
    }

    private void clearClaim(Notification notification) {
        notification.setEmailProcessingStartedAt(null);
        notification.setEmailProcessingToken(null);
    }

    private LocalDateTime now() {
        return LocalDateTime.now(ZoneId.of(appTimeZone));
    }
}
