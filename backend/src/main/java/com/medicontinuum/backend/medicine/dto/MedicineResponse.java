package com.medicontinuum.backend.medicine.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.medicontinuum.backend.medicine.enums.DosageForm;
import com.medicontinuum.backend.medicine.enums.MedicineStatus;

public record MedicineResponse(

        UUID id,

        String name,

        String genericName,

        String brandName,

        String strength,

        DosageForm dosageForm,

        String route,

        String manufacturer,

        String description,

        boolean prescriptionRequired,

        MedicineStatus status,

        LocalDateTime createdAt,

        LocalDateTime updatedAt

) {
}