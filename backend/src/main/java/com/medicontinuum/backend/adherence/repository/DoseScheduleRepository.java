package com.medicontinuum.backend.adherence.repository;

import com.medicontinuum.backend.adherence.entity.DoseSchedule;
import com.medicontinuum.backend.adherence.enums.DoseStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public interface DoseScheduleRepository
        extends JpaRepository<DoseSchedule, UUID> {

    boolean existsByPrescriptionItem_IdAndScheduledAt(
        UUID prescriptionItemId,
        OffsetDateTime scheduledAt
    );

    List<DoseSchedule>
    findByPrescriptionItem_Prescription_Patient_IdAndScheduledAtGreaterThanEqualAndScheduledAtLessThanOrderByScheduledAtAsc(
        UUID patientId,
        OffsetDateTime from,
        OffsetDateTime to
    );

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
        UPDATE DoseSchedule d
        SET d.status = :missed,
            d.updatedAt = :now
        WHERE d.status = :pending
          AND d.scheduledAt < :cutoff
    """)
    int markOverdueDosesAsMissed(
        @Param("pending") DoseStatus pending,
        @Param("missed") DoseStatus missed,
        @Param("cutoff") OffsetDateTime cutoff,
        @Param("now") OffsetDateTime now
    );
}