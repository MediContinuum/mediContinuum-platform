package com.medicontinuum.backend.organisation.entity;

import java.time.LocalDateTime;
import java.util.UUID;
import com.medicontinuum.backend.organisation.enums.OrganisationStatus;
import com.medicontinuum.backend.organisation.enums.OrganisationType;
import com.medicontinuum.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "organisations", uniqueConstraints = @UniqueConstraint(name = "uk_organisation_registration_number", columnNames = "registration_number"), indexes = {
    @Index(name = "idx_organisation_name", columnList = "name"),
    @Index(name = "idx_organisation_status", columnList = "status"),
    @Index(name = "idx_organisation_city", columnList = "city")
})
@Getter @Setter @NoArgsConstructor
public class Organisation {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(nullable = false, length = 150) private String name;
    @Column(name = "registration_number", length = 100) private String registrationNumber;
    @Enumerated(EnumType.STRING) @Column(name = "organisation_type", nullable = false, length = 40) private OrganisationType type;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 30) private OrganisationStatus status = OrganisationStatus.PENDING_VERIFICATION;
    @Column(name = "contact_email", length = 150) private String contactEmail;
    @Column(name = "contact_phone", length = 25) private String contactPhone;
    @Column(length = 255) private String website;
    @Column(name = "address_line", length = 255) private String addressLine;
    @Column(length = 100) private String city;
    @Column(length = 100) private String state;
    @Column(length = 100) private String country;
    @Column(name = "postal_code", length = 20) private String postalCode;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "created_by_user_id", nullable = false) private User createdBy;
    @Column(name = "created_at", nullable = false, updatable = false) private LocalDateTime createdAt;
    @Column(name = "updated_at", nullable = false) private LocalDateTime updatedAt;
    @PrePersist void onCreate() { LocalDateTime now = LocalDateTime.now(); createdAt = now; updatedAt = now; if (status == null) status = OrganisationStatus.PENDING_VERIFICATION; }
    @PreUpdate void onUpdate() { updatedAt = LocalDateTime.now(); }
}
