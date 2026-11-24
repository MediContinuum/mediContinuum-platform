package com.medicontinuum.backend.patient.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medicontinuum.backend.patient.entity.Patient;

public interface PatientRepository extends JpaRepository<Patient, UUID> {

    // Check whether a patient profile exists for a user.
    boolean existsByUser_Id(UUID userId);

    // Find patient profile using the associated user's ID.
    Optional<Patient> findByUser_Id(UUID userId);

    // Find patient profile using the associated user's Global ID.
    Optional<Patient> findByUser_GlobalUserId(String globalUserId);
}