package com.medicontinuum.backend.patient.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;

import com.medicontinuum.backend.patient.entity.Patient;

public interface PatientRepository extends JpaRepository<Patient, UUID> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Patient p WHERE p.id = :id")
    Optional<Patient> findByIdForUpdate(@Param("id") UUID id);


    // Check whether a patient profile exists for a user.
    boolean existsByUser_Id(UUID userId);

    // Find patient profile using the associated user's ID.
    Optional<Patient> findByUser_Id(UUID userId);

    // Find patient profile using the associated user's Global ID.
    Optional<Patient> findByUser_GlobalUserId(String globalUserId);
}