package com.medicontinuum.backend.notification.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import com.medicontinuum.backend.notification.enums.EmailDeliveryStatus;
import com.medicontinuum.backend.notification.enums.NotificationType;
import com.medicontinuum.backend.user.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "notifications",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_notification_recipient_dedup",
            columnNames = {"recipient_id", "deduplication_key"}
        )
    },
    indexes = {
        @Index(
            name = "idx_notification_recipient_created",
            columnList = "recipient_id, created_at"
        ),
        @Index(
            name = "idx_notification_recipient_read",
            columnList = "recipient_id, read_at"
        )
    }
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "recipient_id", nullable = false)
    private User recipient;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private NotificationType type;

    @Column(nullable = false, length = 180)
    private String title;

    @Column(nullable = false, length = 2000)
    private String message;

    @Column(name = "reference_id", length = 100)
    private String referenceId;

    @Column(name = "deduplication_key", length = 200)
    private String deduplicationKey;

    @Column(name = "read_at")
    private LocalDateTime readAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "email_delivery_status", nullable = false, length = 20)
    private EmailDeliveryStatus emailDeliveryStatus;

    @Column(name = "email_sent_at")
    private LocalDateTime emailSentAt;

    @Column(name = "email_attempt_count", nullable = false)
    private int emailAttemptCount;

    @Column(name = "email_next_attempt_at")
    private LocalDateTime emailNextAttemptAt;

    @Column(name = "email_failure_reason", length = 500)
    private String emailFailureReason;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {

        LocalDateTime now = LocalDateTime.now();

        createdAt = now;

        if (emailDeliveryStatus == null) {
            emailDeliveryStatus = EmailDeliveryStatus.NOT_REQUESTED;
        }
    }

    public boolean isRead() {
        return readAt != null;
    }
}