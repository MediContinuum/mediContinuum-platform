package com.medicontinuum.backend.prescription.repository;

import com.medicontinuum.backend.prescription.entity.PrescriptionItem;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PrescriptionItemRepository
        extends JpaRepository<PrescriptionItem, UUID> {

    List<PrescriptionItem> findByPrescription_Id(UUID prescriptionId);

    boolean existsByMedicine_Id(UUID medicineId);
}