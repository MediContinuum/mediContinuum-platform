package com.medicontinuum.backend.notification.dto;

import java.util.List;

public record NotificationPageResponse(

    List<NotificationResponse> notifications,

    int page,

    int size,

    long totalElements,

    int totalPages,

    boolean hasNext,

    boolean hasPrevious
) {}