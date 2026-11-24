package com.medicontinuum.backend.patient.dto;


import java.time.LocalDate;

import com.medicontinuum.backend.patient.enums.BloodGroup;
import com.medicontinuum.backend.patient.enums.Gender;

import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdatePatientRequest(

        @Past(message = "Date of birth must be in the past")
        LocalDate dateOfBirth,

        Gender gender,

        BloodGroup bloodGroup,

        @Size(max = 255)
        String addressLine,

        @Size(max = 100)
        String city,

        @Size(max = 100)
        String state,

        @Size(max = 100)
        String country,

        @Size(max = 20)
        String postalCode,

        @Size(max = 100)
        String emergencyContactName,

        @Pattern(
            regexp = "^[+0-9() .-]{7,20}$",
            message = "Enter a valid emergency contact phone number"
        )
        String emergencyContactPhone

) {
}