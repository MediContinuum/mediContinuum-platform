package com.medicontinuum.backend.medicine.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.medicontinuum.backend.medicine.dto.CreateMedicineRequest;
import com.medicontinuum.backend.medicine.dto.MedicineResponse;
import com.medicontinuum.backend.medicine.dto.UpdateMedicineRequest;
import com.medicontinuum.backend.medicine.enums.MedicineStatus;
import com.medicontinuum.backend.medicine.service.MedicineService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/medicines")
@RequiredArgsConstructor
public class MedicineController {

    private final MedicineService medicineService;

    // 1. Create medicine - Platform Admin only.
    @PostMapping
    @PreAuthorize("hasAuthority('PLATFORM_ADMIN')")
    public ResponseEntity<MedicineResponse> createMedicine(
            @Valid @RequestBody CreateMedicineRequest request
    ) {

        MedicineResponse response =
                medicineService.createMedicine(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // 2. Search and list medicines.
    @GetMapping
    public ResponseEntity<List<MedicineResponse>> getAllMedicines(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) MedicineStatus status
    ) {

        return ResponseEntity.ok(
                medicineService.getAllMedicines(keyword, status)
        );
    }

    // 3. Get medicine by ID.
    @GetMapping("/{medicineId}")
    public ResponseEntity<MedicineResponse> getMedicineById(
            @PathVariable UUID medicineId
    ) {

        return ResponseEntity.ok(
                medicineService.getMedicineById(medicineId)
        );
    }

    // 4. Update medicine details - Platform Admin only.
    @PutMapping("/{medicineId}")
    @PreAuthorize("hasAuthority('PLATFORM_ADMIN')")
    public ResponseEntity<MedicineResponse> updateMedicine(
            @PathVariable UUID medicineId,
            @Valid @RequestBody UpdateMedicineRequest request
    ) {

        return ResponseEntity.ok(
                medicineService.updateMedicine(medicineId, request)
        );
    }

    // 5. Activate or deactivate medicine - Platform Admin only.
    @PatchMapping("/{medicineId}/status")
    @PreAuthorize("hasAuthority('PLATFORM_ADMIN')")
    public ResponseEntity<MedicineResponse> updateMedicineStatus(
            @PathVariable UUID medicineId,
            @RequestParam MedicineStatus status
    ) {

        return ResponseEntity.ok(
                medicineService.updateMedicineStatus(medicineId, status)
        );
    }
}