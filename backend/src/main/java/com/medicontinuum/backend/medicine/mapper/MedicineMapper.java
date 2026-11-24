package com.medicontinuum.backend.medicine.mapper;

import org.springframework.stereotype.Component;

import com.medicontinuum.backend.medicine.dto.CreateMedicineRequest;
import com.medicontinuum.backend.medicine.dto.MedicineResponse;
import com.medicontinuum.backend.medicine.dto.UpdateMedicineRequest;
import com.medicontinuum.backend.medicine.entity.Medicine;
import com.medicontinuum.backend.medicine.enums.MedicineStatus;

@Component
public class MedicineMapper {

    // Convert create request into Medicine entity.
    public Medicine toEntity(CreateMedicineRequest request) {

        return Medicine.builder()
                .name(request.name().trim())
                .genericName(request.genericName().trim())
                .brandName(trimToNull(request.brandName()))
                .strength(request.strength().trim())
                .dosageForm(request.dosageForm())
                .route(trimToNull(request.route()))
                .manufacturer(trimToNull(request.manufacturer()))
                .description(trimToNull(request.description()))
                .prescriptionRequired(request.prescriptionRequired())
                .status(MedicineStatus.ACTIVE)
                .build();
    }

    // Update existing Medicine entity.
    public void updateEntity(
            Medicine medicine,
            UpdateMedicineRequest request
    ) {

        medicine.setName(request.name().trim());
        medicine.setGenericName(request.genericName().trim());
        medicine.setBrandName(trimToNull(request.brandName()));
        medicine.setStrength(request.strength().trim());
        medicine.setDosageForm(request.dosageForm());
        medicine.setRoute(trimToNull(request.route()));
        medicine.setManufacturer(trimToNull(request.manufacturer()));
        medicine.setDescription(trimToNull(request.description()));
        medicine.setPrescriptionRequired(request.prescriptionRequired());
    }

    // Convert Medicine entity into response DTO.
    public MedicineResponse toResponse(Medicine medicine) {

        return new MedicineResponse(
                medicine.getId(),
                medicine.getName(),
                medicine.getGenericName(),
                medicine.getBrandName(),
                medicine.getStrength(),
                medicine.getDosageForm(),
                medicine.getRoute(),
                medicine.getManufacturer(),
                medicine.getDescription(),
                medicine.isPrescriptionRequired(),
                medicine.getStatus(),
                medicine.getCreatedAt(),
                medicine.getUpdatedAt()
        );
    }

    // Convert blank optional strings into null.
    private String trimToNull(String value) {

        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }
}