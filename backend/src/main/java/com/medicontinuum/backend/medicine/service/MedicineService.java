package com.medicontinuum.backend.medicine.service;

import java.util.List;
import java.util.UUID;

import com.medicontinuum.backend.medicine.dto.CreateMedicineRequest;
import com.medicontinuum.backend.medicine.dto.MedicineResponse;
import com.medicontinuum.backend.medicine.dto.UpdateMedicineRequest;
import com.medicontinuum.backend.medicine.enums.MedicineStatus;

public interface MedicineService {

    MedicineResponse createMedicine(CreateMedicineRequest request);

    List<MedicineResponse> getAllMedicines(
            String keyword,
            MedicineStatus status
    );

    MedicineResponse getMedicineById(UUID medicineId);

    MedicineResponse updateMedicine(
            UUID medicineId,
            UpdateMedicineRequest request
    );

    MedicineResponse updateMedicineStatus(
            UUID medicineId,
            MedicineStatus status
    );
}