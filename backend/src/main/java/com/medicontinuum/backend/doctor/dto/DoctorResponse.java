package com.medicontinuum.backend.doctor.dto;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import com.medicontinuum.backend.doctor.enums.DoctorStatus;
public record DoctorResponse(
    UUID id, UUID userId, String globalUserId, String fullName, String email,
    String phoneNumber, String speciality, String licenseNumber, String qualification,
    int yearsExperience, BigDecimal consultationFee, String bio, String city, String state,
    DoctorStatus status, LocalDateTime createdAt, LocalDateTime updatedAt
) {}
