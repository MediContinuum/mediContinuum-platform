package com.medicontinuum.backend.prescription.service;

import java.util.List;
import java.util.UUID;

import com.medicontinuum.backend.prescription.dto.CreatePrescriptionRequest;
import com.medicontinuum.backend.prescription.dto.PrescriptionResponse;
import com.medicontinuum.backend.prescription.enums.PrescriptionStatus;

public interface PrescriptionService {

    PrescriptionResponse createPrescription(
        String doctorEmail,
        CreatePrescriptionRequest request
    );

    PrescriptionResponse getPrescriptionById(UUID prescriptionId);

    List<PrescriptionResponse> getPrescriptionsByPatient(
        UUID patientId,
        PrescriptionStatus status
    );

    List<PrescriptionResponse> getMyIssuedPrescriptions(
        String doctorEmail
    );

    PrescriptionResponse updatePrescriptionStatus(
        UUID prescriptionId,
        PrescriptionStatus status
    );
}