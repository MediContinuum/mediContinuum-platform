package com.medicontinuum.backend.notification.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.medicontinuum.backend.notification.entity.Notification;
import com.medicontinuum.backend.notification.enums.EmailDeliveryStatus;


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

    // PostgreSQL claims only rows not already locked by another worker.
    // COALESCE also handles pending rows created before email_next_attempt_at existed.
    @Query(value = """
            SELECT n.*
            FROM notifications n
            WHERE n.email_delivery_status = :status
              AND COALESCE(n.email_next_attempt_at, n.created_at) <= :now
            ORDER BY COALESCE(n.email_next_attempt_at, n.created_at) ASC
            LIMIT :batchSize
            FOR UPDATE SKIP LOCKED
            """, nativeQuery = true)
    List<Notification> findDueEmailNotificationsForUpdate(
            @Param("status") String status,
            @Param("now") LocalDateTime now,
            @Param("batchSize") int batchSize
    );

    // Return jobs to PENDING after a worker crash or a stuck SMTP operation.
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
            UPDATE Notification n
            SET n.emailDeliveryStatus = :pending,
                n.emailNextAttemptAt = :now,
                n.emailProcessingStartedAt = null,
                n.emailProcessingToken = null,
                n.emailFailureReason = 'Requeued after an email worker timeout'
            WHERE n.emailDeliveryStatus = :processing
              AND n.emailProcessingStartedAt <= :staleBefore
            """)
    int requeueStaleEmailDeliveries(
            @Param("processing") EmailDeliveryStatus processing,
            @Param("pending") EmailDeliveryStatus pending,
            @Param("now") LocalDateTime now,
            @Param("staleBefore") LocalDateTime staleBefore
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