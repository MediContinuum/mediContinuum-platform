package com.medicontinuum.backend.adherence.entity;

import com.medicontinuum.backend.adherence.enums.DoseStatus;
import com.medicontinuum.backend.prescription.entity.PrescriptionItem;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(
    name = "dose_schedules",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_dose_item_scheduled_at",
            columnNames = {"prescription_item_id", "scheduled_at"}
        )
    },
    indexes = {
        @Index(
            name = "idx_dose_schedule_status_time",
            columnList = "status, scheduled_at"
        )
    }
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoseSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "prescription_item_id", nullable = false)
    private PrescriptionItem prescriptionItem;

    @Column(
        name = "scheduled_at",
        nullable = false,
        columnDefinition = "TIMESTAMP WITH TIME ZONE"
    )
    private OffsetDateTime scheduledAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DoseStatus status;

    @Column(
        name = "taken_at",
        columnDefinition = "TIMESTAMP WITH TIME ZONE"
    )
    private OffsetDateTime takenAt;

    @Column(name = "patient_note", length = 500)
    private String patientNote;

    @Column(
        name = "created_at",
        nullable = false,
        columnDefinition = "TIMESTAMP WITH TIME ZONE",
        updatable = false
    )
    private OffsetDateTime createdAt;

    @Column(
        name = "updated_at",
        nullable = false,
        columnDefinition = "TIMESTAMP WITH TIME ZONE"
    )
    private OffsetDateTime updatedAt;

    @PrePersist
    protected void onCreate() {

        OffsetDateTime now = OffsetDateTime.now();

        if (status == null) {
            status = DoseStatus.PENDING;
        }

        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }
}