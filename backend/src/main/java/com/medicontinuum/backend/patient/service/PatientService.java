
package com.medicontinuum.backend.patient.service;

import java.util.List;
import java.util.UUID;

import com.medicontinuum.backend.patient.dto.CreatePatientRequest;
import com.medicontinuum.backend.patient.dto.PatientResponse;
import com.medicontinuum.backend.patient.dto.UpdatePatientRequest;

public interface PatientService {

    PatientResponse createPatient(CreatePatientRequest request);

    List<PatientResponse> getAllPatients();

    PatientResponse getPatientById(UUID patientId);

    PatientResponse getPatientByGlobalUserId(String globalUserId);

    PatientResponse updatePatient(
            UUID patientId,
            UpdatePatientRequest request
    );

    void deletePatientProfile(UUID patientId);
}
