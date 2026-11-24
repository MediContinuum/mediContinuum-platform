package com.medicontinuum.backend.notification.repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.medicontinuum.backend.notification.entity.Notification;

public interface NotificationRepository
        extends JpaRepository<Notification, UUID> {

    // Get all notifications for a recipient.
    Page<Notification> findByRecipient_IdOrderByCreatedAtDesc(
            UUID recipientId,
            Pageable pageable
    );

    // Get unread notifications for a recipient.
    Page<Notification> findByRecipient_IdAndReadAtIsNullOrderByCreatedAtDesc(
            UUID recipientId,
            Pageable pageable
    );

    // Find a notification belonging to a specific recipient.
    Optional<Notification> findByIdAndRecipient_Id(
            UUID notificationId,
            UUID recipientId
    );

    // Find notification using recipient and deduplication key.
    Optional<Notification> findByRecipient_IdAndDeduplicationKey(
            UUID recipientId,
            String deduplicationKey
    );

    // Count all notifications.
    long countByRecipient_Id(UUID recipientId);

    // Count unread notifications.
    long countByRecipient_IdAndReadAtIsNull(UUID recipientId);

    // Count read notifications.
    long countByRecipient_IdAndReadAtIsNotNull(UUID recipientId);

    // Delete a notification belonging to a specific recipient.
    int deleteByIdAndRecipient_Id(
            UUID notificationId,
            UUID recipientId
    );

    // Mark all unread notifications as read for a recipient.
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
            UPDATE Notification n
            SET n.readAt = :readAt
            WHERE n.recipient.id = :recipientId
            AND n.readAt IS NULL
            """)
    int markAllAsRead(
            @Param("recipientId") UUID recipientId,
            @Param("readAt") LocalDateTime readAt
    );
}