package com.medicontinuum.backend.prescription.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.medicontinuum.backend.prescription.dto.PrescriptionItemResponse;
import com.medicontinuum.backend.prescription.dto.PrescriptionResponse;
import com.medicontinuum.backend.prescription.entity.Prescription;
import com.medicontinuum.backend.prescription.entity.PrescriptionItem;

@Component
public class PrescriptionMapper {

    public PrescriptionResponse toResponse(Prescription prescription) {

        List<PrescriptionItemResponse> itemResponses =
            prescription.getItems()
                .stream()
                .map(this::toItemResponse)
                .toList();

        return new PrescriptionResponse(
            prescription.getId(),
            prescription.getPatient().getId(),
            prescription.getPatient().getUser().getGlobalUserId(),
            prescription.getPatient().getUser().getFullName(),
            prescription.getPrescribedBy().getId(),
            prescription.getPrescribedBy().getFullName(),
            prescription.getStatus(),
            prescription.getNotes(),
            prescription.getIssuedAt(),
            prescription.getCreatedAt(),
            itemResponses
        );
    }

    private PrescriptionItemResponse toItemResponse(
        PrescriptionItem item
    ) {
        return new PrescriptionItemResponse(
            item.getId(),
            item.getMedicine().getId(),
            item.getMedicine().getName(),
            item.getMedicine().getGenericName(),
            item.getMedicine().getStrength(),
            item.getDosageAmount(),
            item.getDosageUnit(),
            item.getFrequency(),
            item.getStartDate(),
            item.getEndDate(),
            item.getInstructions()
        );
    }
}