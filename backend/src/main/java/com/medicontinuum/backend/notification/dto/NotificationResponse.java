package com.medicontinuum.backend.notification.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.medicontinuum.backend.notification.enums.EmailDeliveryStatus;
import com.medicontinuum.backend.notification.enums.NotificationType;

public record NotificationResponse(

    UUID id,

    NotificationType type,

    String title,

    String message,

    String referenceId,

    boolean read,

    LocalDateTime readAt,

    EmailDeliveryStatus emailDeliveryStatus,

    LocalDateTime createdAt
) {}