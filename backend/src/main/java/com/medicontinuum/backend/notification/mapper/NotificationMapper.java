package com.medicontinuum.backend.notification.mapper;

import org.springframework.stereotype.Component;

import com.medicontinuum.backend.notification.dto.NotificationResponse;
import com.medicontinuum.backend.notification.entity.Notification;

@Component
public class NotificationMapper {

    public NotificationResponse toResponse(Notification notification) {

        return new NotificationResponse(
            notification.getId(),
            notification.getType(),
            notification.getTitle(),
            notification.getMessage(),
            notification.getReferenceId(),
            notification.isRead(),
            notification.getReadAt(),
            notification.getEmailDeliveryStatus(),
            notification.getCreatedAt()
        );
    }
}