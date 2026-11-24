package com.medicontinuum.backend.patient.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medicontinuum.backend.patient.entity.Patient;

public interface PatientRepository extends JpaRepository<Patient, UUID> {

    boolean existsByUser_Id(UUID userId);

    Optional<Patient> findByUser_GlobalUserId(String globalUserId);
}