package com.medicontinuum.backend.notification.dto;

public record NotificationSummaryResponse(

    long totalNotifications,

    long unreadNotifications,

    long readNotifications
) {}