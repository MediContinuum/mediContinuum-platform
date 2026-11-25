package com.medicontinuum.backend.doctor.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import com.medicontinuum.backend.doctor.enums.DoctorStatus;
import com.medicontinuum.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "doctors", uniqueConstraints = {
    @UniqueConstraint(name = "uk_doctor_user", columnNames = "user_id"),
    @UniqueConstraint(name = "uk_doctor_license", columnNames = "license_number")
}, indexes = {
    @Index(name = "idx_doctor_speciality", columnList = "speciality"),
    @Index(name = "idx_doctor_city", columnList = "city"),
    @Index(name = "idx_doctor_status", columnList = "status")
})
@Getter @Setter @NoArgsConstructor
public class Doctor {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @OneToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "user_id", nullable = false, unique = true) private User user;
    @Column(nullable = false, length = 120) private String speciality;
    @Column(name = "license_number", nullable = false, length = 100) private String licenseNumber;
    @Column(length = 200) private String qualification;
    @Column(name = "years_experience", nullable = false) private int yearsExperience;
    @Column(name = "consultation_fee", precision = 12, scale = 2) private BigDecimal consultationFee;
    @Column(length = 2000) private String bio;
    @Column(length = 100) private String city;
    @Column(length = 100) private String state;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private DoctorStatus status = DoctorStatus.ACTIVE;
    @Column(name = "created_at", nullable = false, updatable = false) private LocalDateTime createdAt;
    @Column(name = "updated_at", nullable = false) private LocalDateTime updatedAt;
    @PrePersist void onCreate() { LocalDateTime now=LocalDateTime.now(); createdAt=now; updatedAt=now; }
    @PreUpdate void onUpdate() { updatedAt=LocalDateTime.now(); }
}
