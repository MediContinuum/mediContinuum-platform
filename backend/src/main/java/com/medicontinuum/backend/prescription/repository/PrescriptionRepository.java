package com.medicontinuum.backend.prescription.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medicontinuum.backend.prescription.entity.Prescription;
import com.medicontinuum.backend.prescription.enums.PrescriptionStatus;

public interface PrescriptionRepository
        extends JpaRepository<Prescription, UUID> {

    List<Prescription> findByPatient_IdOrderByCreatedAtDesc(UUID patientId);

    List<Prescription> findByPatient_IdAndStatusOrderByCreatedAtDesc(
        UUID patientId,
        PrescriptionStatus status
    );

    List<Prescription> findByPrescribedBy_IdOrderByCreatedAtDesc(
        UUID userId
    );
}