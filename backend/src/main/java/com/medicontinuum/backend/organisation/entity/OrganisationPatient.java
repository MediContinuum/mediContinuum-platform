package com.medicontinuum.backend.organisation.entity;

import java.time.LocalDateTime;
import java.util.UUID;
import com.medicontinuum.backend.organisation.enums.OrganisationPatientStatus;
import com.medicontinuum.backend.patient.entity.Patient;
import com.medicontinuum.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "organisation_patients", uniqueConstraints = @UniqueConstraint(name = "uk_organisation_patient", columnNames = {"organisation_id", "patient_id"}), indexes = {
    @Index(name = "idx_org_patient_org_status", columnList = "organisation_id, status"),
    @Index(name = "idx_org_patient_patient", columnList = "patient_id")
})
@Getter @Setter @NoArgsConstructor
public class OrganisationPatient {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "organisation_id", nullable = false) private Organisation organisation;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "patient_id", nullable = false) private Patient patient;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "assigned_by_user_id", nullable = false) private User assignedBy;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private OrganisationPatientStatus status = OrganisationPatientStatus.ACTIVE;
    @Column(name = "created_at", nullable = false, updatable = false) private LocalDateTime createdAt;
    @Column(name = "updated_at", nullable = false) private LocalDateTime updatedAt;
    @PrePersist void onCreate() { LocalDateTime now = LocalDateTime.now(); createdAt = now; updatedAt = now; if (status == null) status = OrganisationPatientStatus.ACTIVE; }
    @PreUpdate void onUpdate() { updatedAt = LocalDateTime.now(); }
}
