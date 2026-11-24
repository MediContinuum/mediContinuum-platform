package com.medicontinuum.backend.notification.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.medicontinuum.backend.notification.entity.Notification;
import com.medicontinuum.backend.notification.enums.EmailDeliveryStatus;
import com.medicontinuum.backend.notification.repository.NotificationRepository;
import com.medicontinuum.backend.notification.service.NotificationEmailSender;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationEmailDeliveryService {

    private final NotificationRepository notificationRepository;
    private final NotificationEmailSender notificationEmailSender;

    @Value("${notification.email.max-attempts:5}")
    private int maxAttempts;

    // Runs from the scheduler. Notifications are already committed before SMTP is called.
    @Transactional
    public int deliverPendingEmails() {

        List<Notification> pending = notificationRepository
                .findDueEmailNotifications(
                        EmailDeliveryStatus.PENDING,
                        LocalDateTime.now(),
                        PageRequest.of(0, 50)
                );

        int processed = 0;

        for (Notification notification : pending) {

            int attempts = notification.getEmailAttemptCount() + 1;
            notification.setEmailAttemptCount(attempts);

            try {
                notificationEmailSender.sendEmail(
                        notification.getRecipient().getEmail(),
                        notification.getTitle(),
                        notification.getMessage()
                );

                notification.setEmailDeliveryStatus(EmailDeliveryStatus.SENT);
                notification.setEmailSentAt(LocalDateTime.now());
                notification.setEmailFailureReason(null);
                notification.setEmailNextAttemptAt(null);

            } catch (Exception exception) {

                String reason = exception.getMessage();
                if (reason == null || reason.isBlank()) {
                    reason = exception.getClass().getSimpleName();
                }
                if (reason.length() > 500) {
                    reason = reason.substring(0, 500);
                }
                notification.setEmailFailureReason(reason);

                if (attempts >= maxAttempts) {
                    notification.setEmailDeliveryStatus(EmailDeliveryStatus.FAILED);
                    notification.setEmailNextAttemptAt(null);
                    log.error(
                            "Email delivery permanently failed for notification {} after {} attempts",
                            notification.getId(),
                            attempts
                    );
                } else {
                    long retryDelayMinutes = Math.min(60L, 1L << Math.min(attempts - 1, 6));
                    notification.setEmailDeliveryStatus(EmailDeliveryStatus.PENDING);
                    notification.setEmailNextAttemptAt(
                            LocalDateTime.now().plusMinutes(retryDelayMinutes)
                    );
                    log.warn(
                            "Email delivery failed for notification {}. Retry {}/{} scheduled in {} minute(s)",
                            notification.getId(),
                            attempts,
                            maxAttempts,
                            retryDelayMinutes
                    );
                }
            }

            notificationRepository.save(notification);
            processed++;
        }

        return processed;
    }
}
