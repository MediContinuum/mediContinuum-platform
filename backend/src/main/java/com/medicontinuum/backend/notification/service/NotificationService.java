package com.medicontinuum.backend.notification.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

import com.medicontinuum.backend.notification.dto.NotificationPageResponse;
import com.medicontinuum.backend.notification.dto.NotificationResponse;
import com.medicontinuum.backend.notification.dto.NotificationSummaryResponse;

public interface NotificationService {

    // General notification creation
    NotificationResponse createNotification(
        String recipientEmail,
        String title,
        String message
    );

    // Events from other modules
    NotificationResponse notifyMissedDose(
        String recipientEmail,
        UUID doseScheduleId,
        String medicineName,
        OffsetDateTime scheduledAt
    );

    NotificationResponse notifyLowStock(
        String recipientEmail,
        UUID inventoryItemId,
        String medicineName,
        BigDecimal availableQuantity,
        String unit
    );

    NotificationResponse notifyExpiryWarning(
        String recipientEmail,
        UUID batchId,
        String medicineName,
        LocalDate expiryDate,
        BigDecimal remainingQuantity,
        String unit
    );

    NotificationResponse notifyPrescriptionCreated(
        String recipientEmail,
        UUID prescriptionId,
        String doctorName
    );

    // User notification APIs
    NotificationPageResponse getMyNotifications(
        String recipientEmail,
        boolean unreadOnly,
        int page,
        int size
    );

    NotificationSummaryResponse getMySummary(
        String recipientEmail
    );

    NotificationResponse markAsRead(
        String recipientEmail,
        UUID notificationId
    );

    int markAllAsRead(String recipientEmail);

    void deleteNotification(
        String recipientEmail,
        UUID notificationId
    );
}