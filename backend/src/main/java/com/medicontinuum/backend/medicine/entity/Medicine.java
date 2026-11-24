package com.medicontinuum.backend.medicine.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import com.medicontinuum.backend.medicine.enums.DosageForm;
import com.medicontinuum.backend.medicine.enums.MedicineStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "medicines",
    indexes = {
        @Index(name = "idx_medicine_name", columnList = "name"),
        @Index(name = "idx_medicine_generic_name", columnList = "generic_name"),
        @Index(name = "idx_medicine_status", columnList = "status")
    }
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "generic_name", nullable = false, length = 150)
    private String genericName;

    @Column(name = "brand_name", length = 150)
    private String brandName;

    @Column(nullable = false, length = 80)
    private String strength;

    @Enumerated(EnumType.STRING)
    @Column(name = "dosage_form", nullable = false, length = 30)
    private DosageForm dosageForm;

    @Column(length = 80)
    private String route;

    @Column(length = 150)
    private String manufacturer;

    @Column(length = 1000)
    private String description;

    @Column(name = "prescription_required", nullable = false)
    private boolean prescriptionRequired;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MedicineStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;

        if (status == null) {
            status = MedicineStatus.ACTIVE;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}