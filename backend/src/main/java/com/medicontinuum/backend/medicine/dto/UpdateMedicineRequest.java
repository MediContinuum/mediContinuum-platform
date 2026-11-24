package com.medicontinuum.backend.medicine.dto;

import com.medicontinuum.backend.medicine.enums.DosageForm;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateMedicineRequest(

        @NotBlank
        @Size(max = 150)
        String name,

        @NotBlank
        @Size(max = 150)
        String genericName,

        @Size(max = 150)
        String brandName,

        @NotBlank
        @Size(max = 80)
        String strength,

        @NotNull
        DosageForm dosageForm,

        @Size(max = 80)
        String route,

        @Size(max = 150)
        String manufacturer,

        @Size(max = 1000)
        String description,

        boolean prescriptionRequired

) {
}