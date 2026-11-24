
package com.medicontinuum.backend.patient.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medicontinuum.backend.patient.dto.CreatePatientRequest;
import com.medicontinuum.backend.patient.dto.PatientResponse;
import com.medicontinuum.backend.patient.dto.UpdatePatientRequest;
import com.medicontinuum.backend.patient.service.PatientService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    // Create a patient profile for an existing user.
    @PostMapping
    @PreAuthorize("hasAuthority('PLATFORM_ADMIN')")
    public ResponseEntity<PatientResponse> createPatient(
            @Valid @RequestBody CreatePatientRequest request
    ) {

        PatientResponse response = patientService.createPatient(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // Get all patient profiles.
    @GetMapping
    @PreAuthorize("hasAuthority('PLATFORM_ADMIN')")
    public ResponseEntity<List<PatientResponse>> getAllPatients() {

        return ResponseEntity.ok(
                patientService.getAllPatients()
        );
    }

    // Get patient by internal UUID.
    @GetMapping("/{patientId}")
    @PreAuthorize("hasAuthority('PLATFORM_ADMIN')")
    public ResponseEntity<PatientResponse> getPatientById(
            @PathVariable UUID patientId
    ) {

        return ResponseEntity.ok(
                patientService.getPatientById(patientId)
        );
    }

    // Get patient by Global MediContinuum ID.
    @GetMapping("/global-id/{globalUserId}")
    @PreAuthorize("hasAuthority('PLATFORM_ADMIN')")
    public ResponseEntity<PatientResponse> getPatientByGlobalUserId(
            @PathVariable String globalUserId
    ) {

        return ResponseEntity.ok(
                patientService.getPatientByGlobalUserId(globalUserId)
        );
    }

    // Update patient profile.
    @PutMapping("/{patientId}")
    @PreAuthorize("hasAuthority('PLATFORM_ADMIN')")
    public ResponseEntity<PatientResponse> updatePatient(
            @PathVariable UUID patientId,
            @Valid @RequestBody UpdatePatientRequest request
    ) {

        return ResponseEntity.ok(
                patientService.updatePatient(patientId, request)
        );
    }
}
