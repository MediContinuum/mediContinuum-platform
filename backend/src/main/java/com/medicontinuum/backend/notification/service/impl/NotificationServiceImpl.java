package com.medicontinuum.backend.notification.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.medicontinuum.backend.notification.dto.NotificationPageResponse;
import com.medicontinuum.backend.notification.dto.NotificationResponse;
import com.medicontinuum.backend.notification.dto.NotificationSummaryResponse;
import com.medicontinuum.backend.notification.entity.Notification;
import com.medicontinuum.backend.notification.enums.EmailDeliveryStatus;
import com.medicontinuum.backend.notification.enums.NotificationType;
import com.medicontinuum.backend.notification.mapper.NotificationMapper;
import com.medicontinuum.backend.notification.repository.NotificationRepository;
import com.medicontinuum.backend.notification.service.NotificationService;
import com.medicontinuum.backend.user.entity.User;
import com.medicontinuum.backend.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final NotificationMapper notificationMapper;

    @Value("${notification.email.enabled:false}")
    private boolean emailEnabled;

    // ---------------------------------------------------------
    // 1. General notification
    // ---------------------------------------------------------

    @Override
    public NotificationResponse createNotification(
        String recipientEmail,
        String title,
        String message
    ) {

        User recipient = findUser(recipientEmail);

        String deduplicationKey = "GENERAL:" + UUID.randomUUID();

        return createAndQueue(
            recipient,
            NotificationType.GENERAL,
            title,
            message,
            null,
            deduplicationKey,
            false
        );
    }

    // ---------------------------------------------------------
    // 2. Missed-dose notification
    // ---------------------------------------------------------

    @Override
    public NotificationResponse notifyMissedDose(
        String recipientEmail,
        UUID doseScheduleId,
        String medicineName,
        OffsetDateTime scheduledAt
    ) {

        User recipient = findUser(recipientEmail);

        String title = "Missed medicine dose";

        String message =
            "Your scheduled dose of " + medicineName
            + " was not confirmed. Scheduled time: "
            + scheduledAt + ". Please update your dose record.";

        String deduplicationKey =
            "MISSED_DOSE:" + doseScheduleId;

        return createAndQueue(
            recipient,
            NotificationType.MISSED_DOSE,
            title,
            message,
            doseScheduleId.toString(),
            deduplicationKey,
            true
        );
    }

    // ---------------------------------------------------------
    // 3. Low-stock notification
    // ---------------------------------------------------------

    @Override
    public NotificationResponse notifyLowStock(
        String recipientEmail,
        UUID inventoryItemId,
        String medicineName,
        BigDecimal availableQuantity,
        String unit
    ) {

        User recipient = findUser(recipientEmail);

        String title = "Medicine stock running low";

        String message =
            "Your available stock of " + medicineName
            + " is " + availableQuantity + " " + unit
            + ". Please arrange a refill when appropriate.";

        // Limit repeated alerts to one per inventory item per day.
        String deduplicationKey =
            "LOW_STOCK:" + inventoryItemId + ":" + LocalDate.now();

        return createAndQueue(
            recipient,
            NotificationType.LOW_STOCK,
            title,
            message,
            inventoryItemId.toString(),
            deduplicationKey,
            true
        );
    }

    // ---------------------------------------------------------
    // 4. Expiry-warning notification
    // ---------------------------------------------------------

    @Override
    public NotificationResponse notifyExpiryWarning(
        String recipientEmail,
        UUID batchId,
        String medicineName,
        LocalDate expiryDate,
        BigDecimal remainingQuantity,
        String unit
    ) {

        User recipient = findUser(recipientEmail);

        String title = "Medicine batch nearing expiry";

        String message =
            "Your batch of " + medicineName
            + " has " + remainingQuantity + " " + unit
            + " remaining and has an expiry date of "
            + expiryDate
            + ". Check the packaging and consult a pharmacist "
            + "or healthcare professional before use.";

        String deduplicationKey =
            "EXPIRY_WARNING:" + batchId + ":" + expiryDate;

        return createAndQueue(
            recipient,
            NotificationType.EXPIRY_WARNING,
            title,
            message,
            batchId.toString(),
            deduplicationKey,
            true
        );
    }

    // ---------------------------------------------------------
    // 5. New-prescription notification
    // ---------------------------------------------------------

    @Override
    public NotificationResponse notifyPrescriptionCreated(
        String recipientEmail,
        UUID prescriptionId,
        String doctorName
    ) {

        User recipient = findUser(recipientEmail);

        String title = "New prescription created";

        String message =
            "A new prescription has been created by "
            + doctorName
            + ". Please log in to view the prescription details.";

        String deduplicationKey =
            "PRESCRIPTION_CREATED:" + prescriptionId;

        return createAndQueue(
            recipient,
            NotificationType.PRESCRIPTION_CREATED,
            title,
            message,
            prescriptionId.toString(),
            deduplicationKey,
            true
        );
    }

    // ---------------------------------------------------------
    // 6. Get user notifications with pagination
    // ---------------------------------------------------------

    @Override
    @Transactional(readOnly = true)
    public NotificationPageResponse getMyNotifications(
        String recipientEmail,
        boolean unreadOnly,
        int page,
        int size
    ) {

        validatePagination(page, size);

        User recipient = findUser(recipientEmail);

        PageRequest pageRequest = PageRequest.of(
            page,
            size,
            Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Page<Notification> notificationPage;

        if (unreadOnly) {

            notificationPage =
                notificationRepository
                    .findByRecipient_IdAndReadAtIsNullOrderByCreatedAtDesc(
                        recipient.getId(),
                        pageRequest
                    );

        } else {

            notificationPage =
                notificationRepository
                    .findByRecipient_IdOrderByCreatedAtDesc(
                        recipient.getId(),
                        pageRequest
                    );
        }

        return new NotificationPageResponse(
            notificationPage.getContent()
                .stream()
                .map(notificationMapper::toResponse)
                .toList(),

            notificationPage.getNumber(),
            notificationPage.getSize(),
            notificationPage.getTotalElements(),
            notificationPage.getTotalPages(),
            notificationPage.hasNext(),
            notificationPage.hasPrevious()
        );
    }

    // ---------------------------------------------------------
    // 7. Get notification counts
    // ---------------------------------------------------------

    @Override
    @Transactional(readOnly = true)
    public NotificationSummaryResponse getMySummary(
        String recipientEmail
    ) {

        User recipient = findUser(recipientEmail);

        long total = notificationRepository
            .countByRecipient_Id(recipient.getId());

        long unread = notificationRepository
            .countByRecipient_IdAndReadAtIsNull(recipient.getId());

        long read = notificationRepository
            .countByRecipient_IdAndReadAtIsNotNull(recipient.getId());

        return new NotificationSummaryResponse(
            total,
            unread,
            read
        );
    }

    // ---------------------------------------------------------
    // 8. Mark one notification as read
    // ---------------------------------------------------------

    @Override
    public NotificationResponse markAsRead(
        String recipientEmail,
        UUID notificationId
    ) {

        User recipient = findUser(recipientEmail);

        Notification notification = notificationRepository
            .findByIdAndRecipient_Id(
                notificationId,
                recipient.getId()
            )
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Notification not found"
            ));

        if (!notification.isRead()) {
            notification.setReadAt(LocalDateTime.now());
        }

        Notification saved = notificationRepository.save(notification);

        return notificationMapper.toResponse(saved);
    }

    // ---------------------------------------------------------
    // 9. Mark all notifications as read
    // ---------------------------------------------------------

    @Override
    @Transactional 
    public int markAllAsRead(String recipientEmail) {

        User recipient = findUser(recipientEmail);

        return notificationRepository.markAllAsRead(
            recipient.getId(),
            LocalDateTime.now()
        );
    }

    // ---------------------------------------------------------
    // 10. Delete one notification
    // ---------------------------------------------------------

    @Override
    public void deleteNotification(
        String recipientEmail,
        UUID notificationId
    ) {

        User recipient = findUser(recipientEmail);

        Notification notification = notificationRepository
            .findByIdAndRecipient_Id(
                notificationId,
                recipient.getId()
            )
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Notification not found"
            ));

        notificationRepository.delete(notification);
    }

    // =========================================================
    // Helper: Create and queue an optional email
    // =========================================================

    private NotificationResponse createAndQueue(
        User recipient,
        NotificationType type,
        String title,
        String message,
        String referenceId,
        String deduplicationKey,
        boolean requestEmail
    ) {

        // Check whether this event was already notified.
        var existing = notificationRepository
            .findByRecipient_IdAndDeduplicationKey(
                recipient.getId(),
                deduplicationKey
            );

        if (existing.isPresent()) {
            return notificationMapper.toResponse(existing.get());
        }

        EmailDeliveryStatus initialEmailStatus;

        if (!requestEmail) {
            initialEmailStatus = EmailDeliveryStatus.NOT_REQUESTED;
        } else if (!emailEnabled) {
            initialEmailStatus = EmailDeliveryStatus.DISABLED;
        } else {
            initialEmailStatus = EmailDeliveryStatus.PENDING;
        }

        Notification notification = Notification.builder()
            .recipient(recipient)
            .type(type)
            .title(validateTitle(title))
            .message(validateMessage(message))
            .referenceId(referenceId)
            .deduplicationKey(deduplicationKey)
            .emailDeliveryStatus(initialEmailStatus)
            .emailNextAttemptAt(
                initialEmailStatus == EmailDeliveryStatus.PENDING
                    ? LocalDateTime.now()
                    : null
            )
            .build();

        Notification saved = notificationRepository.save(notification);


        return notificationMapper.toResponse(saved);
    }

    private User findUser(String email) {

        return userRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "User not found"
            ));
    }

    private void validatePagination(int page, int size) {

        if (page < 0) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Page number cannot be negative"
            );
        }

        if (size < 1 || size > 100) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Page size must be between 1 and 100"
            );
        }
    }

    private String validateTitle(String title) {

        if (title == null || title.isBlank() || title.length() > 180) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Notification title must contain 1 to 180 characters"
            );
        }

        return title.trim();
    }

    private String validateMessage(String message) {

        if (message == null ||
            message.isBlank() ||
            message.length() > 2000) {

            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Notification message must contain 1 to 2000 characters"
            );
        }

        return message.trim();
    }
}