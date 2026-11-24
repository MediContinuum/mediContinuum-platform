package com.medicontinuum.backend.prescription.entity;

import com.medicontinuum.backend.medicine.entity.Medicine;
import com.medicontinuum.backend.prescription.enums.PrescriptionFrequency;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(
    name = "prescription_items",
    indexes = {
        @Index(name = "idx_prescription_item_prescription", columnList = "prescription_id"),
        @Index(name = "idx_prescription_item_medicine", columnList = "medicine_id")
    }
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "prescription_id", nullable = false)
    private Prescription prescription;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "medicine_id", nullable = false)
    private Medicine medicine;

    @Column(name = "dosage_amount", nullable = false, precision = 8, scale = 2)
    private BigDecimal dosageAmount;

    @Column(name = "dosage_unit", nullable = false, length = 40)
    private String dosageUnit;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private PrescriptionFrequency frequency;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(length = 500)
    private String instructions;
}