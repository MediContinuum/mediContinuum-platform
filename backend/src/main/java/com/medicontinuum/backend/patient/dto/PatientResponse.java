package com.medicontinuum.backend.patient.dto;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import com.medicontinuum.backend.patient.enums.BloodGroup;
import com.medicontinuum.backend.patient.enums.Gender;

public record PatientResponse(

        UUID patientId,

        String globalUserId,

        String fullName,

        String email,

        String phoneNumber,

        LocalDate dateOfBirth,

        Gender gender,

        BloodGroup bloodGroup,

        String addressLine,

        String city,

        String state,

        String country,

        String postalCode,

        String emergencyContactName,

        String emergencyContactPhone,

        LocalDateTime createdAt,

        LocalDateTime updatedAt

) {
}