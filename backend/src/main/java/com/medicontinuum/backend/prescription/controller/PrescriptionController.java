package com.medicontinuum.backend.prescription.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.medicontinuum.backend.prescription.dto.CreatePrescriptionRequest;
import com.medicontinuum.backend.prescription.dto.PrescriptionResponse;
import com.medicontinuum.backend.prescription.dto.UpdatePrescriptionStatusRequest;
import com.medicontinuum.backend.prescription.enums.PrescriptionStatus;
import com.medicontinuum.backend.prescription.service.PrescriptionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/prescriptions")
@RequiredArgsConstructor
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    // Create a prescription
    @PostMapping
    @PreAuthorize("hasAnyAuthority('PLATFORM_ADMIN', 'DOCTOR')")
    public ResponseEntity<PrescriptionResponse> createPrescription(
        @Valid @RequestBody CreatePrescriptionRequest request,
        org.springframework.security.core.Authentication authentication
    ) {

        PrescriptionResponse response =
            prescriptionService.createPrescription(
                authentication.getName(),
                request
            );

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(response);
    }

    // Get prescription by ID
    @GetMapping("/{prescriptionId}")
    @PreAuthorize("hasAnyAuthority('PLATFORM_ADMIN', 'DOCTOR')")
    public ResponseEntity<PrescriptionResponse> getPrescriptionById(
        @PathVariable UUID prescriptionId
    ) {

        return ResponseEntity.ok(
            prescriptionService.getPrescriptionById(prescriptionId)
        );
    }

    // Get prescriptions for a patient
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyAuthority('PLATFORM_ADMIN', 'DOCTOR')")
    public ResponseEntity<List<PrescriptionResponse>> getPrescriptionsByPatient(
        @PathVariable UUID patientId,
        @RequestParam(required = false) PrescriptionStatus status
    ) {

        return ResponseEntity.ok(
            prescriptionService.getPrescriptionsByPatient(patientId, status)
        );
    }

    // Get prescriptions issued by the logged-in doctor
    @GetMapping("/my-issued")
    @PreAuthorize("hasAnyAuthority('PLATFORM_ADMIN', 'DOCTOR')")
    public ResponseEntity<List<PrescriptionResponse>> getMyIssuedPrescriptions(
        org.springframework.security.core.Authentication authentication
    ) {

        return ResponseEntity.ok(
            prescriptionService.getMyIssuedPrescriptions(
                authentication.getName()
            )
        );
    }

    // Update prescription status
    @PatchMapping("/{prescriptionId}/status")
    @PreAuthorize("hasAnyAuthority('PLATFORM_ADMIN', 'DOCTOR')")
    public ResponseEntity<PrescriptionResponse> updatePrescriptionStatus(
        @PathVariable UUID prescriptionId,
        @Valid @RequestBody UpdatePrescriptionStatusRequest request
    ) {

        return ResponseEntity.ok(
            prescriptionService.updatePrescriptionStatus(
                prescriptionId,
                request.status()
            )
        );
    }
}