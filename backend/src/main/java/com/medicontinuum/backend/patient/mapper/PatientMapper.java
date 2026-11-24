package com.medicontinuum.backend.patient.mapper;


import org.springframework.stereotype.Component;

import com.medicontinuum.backend.patient.dto.PatientResponse;
import com.medicontinuum.backend.patient.entity.Patient;

@Component
public class PatientMapper {

    public PatientResponse toResponse(Patient patient) {

        return new PatientResponse(
                patient.getId(),
                patient.getUser().getGlobalUserId(),
                patient.getUser().getFullName(),
                patient.getUser().getEmail(),
                patient.getUser().getPhoneNumber(),
                patient.getDateOfBirth(),
                patient.getGender(),
                patient.getBloodGroup(),
                patient.getAddressLine(),
                patient.getCity(),
                patient.getState(),
                patient.getCountry(),
                patient.getPostalCode(),
                patient.getEmergencyContactName(),
                patient.getEmergencyContactPhone(),
                patient.getCreatedAt(),
                patient.getUpdatedAt()
        );
    }
}