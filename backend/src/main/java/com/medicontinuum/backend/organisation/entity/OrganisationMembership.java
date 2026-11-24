package com.medicontinuum.backend.organisation.entity;

import java.time.LocalDateTime;
import java.util.UUID;
import com.medicontinuum.backend.organisation.enums.OrganisationMemberRole;
import com.medicontinuum.backend.organisation.enums.OrganisationMemberStatus;
import com.medicontinuum.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "organisation_memberships", uniqueConstraints = @UniqueConstraint(name = "uk_organisation_membership_user", columnNames = {"organisation_id", "user_id"}), indexes = {
    @Index(name = "idx_org_membership_org_status", columnList = "organisation_id, status"),
    @Index(name = "idx_org_membership_user_status", columnList = "user_id, status")
})
@Getter @Setter @NoArgsConstructor
public class OrganisationMembership {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "organisation_id", nullable = false) private Organisation organisation;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "user_id", nullable = false) private User user;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 30) private OrganisationMemberRole role;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private OrganisationMemberStatus status = OrganisationMemberStatus.ACTIVE;
    @Column(name = "created_at", nullable = false, updatable = false) private LocalDateTime createdAt;
    @Column(name = "updated_at", nullable = false) private LocalDateTime updatedAt;
    @PrePersist void onCreate() { LocalDateTime now = LocalDateTime.now(); createdAt = now; updatedAt = now; if (status == null) status = OrganisationMemberStatus.ACTIVE; }
    @PreUpdate void onUpdate() { updatedAt = LocalDateTime.now(); }
}
