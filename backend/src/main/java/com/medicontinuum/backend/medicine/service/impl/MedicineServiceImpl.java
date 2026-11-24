package com.medicontinuum.backend.medicine.service.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.medicontinuum.backend.medicine.dto.CreateMedicineRequest;
import com.medicontinuum.backend.medicine.dto.MedicineResponse;
import com.medicontinuum.backend.medicine.dto.UpdateMedicineRequest;
import com.medicontinuum.backend.medicine.entity.Medicine;
import com.medicontinuum.backend.medicine.enums.MedicineStatus;
import com.medicontinuum.backend.medicine.exception.MedicineNotFoundException;
import com.medicontinuum.backend.medicine.mapper.MedicineMapper;
import com.medicontinuum.backend.medicine.repository.MedicineRepository;
import com.medicontinuum.backend.medicine.service.MedicineService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class MedicineServiceImpl implements MedicineService {

    private final MedicineRepository medicineRepository;
    private final MedicineMapper medicineMapper;

    // 1. Create a new medicine.
    @Override
    public MedicineResponse createMedicine(CreateMedicineRequest request) {

        validateDuplicateMedicine(
                request.name(),
                request.genericName(),
                request.strength(),
                request.dosageForm(),
                null
        );

        Medicine medicine = medicineMapper.toEntity(request);

        Medicine savedMedicine = medicineRepository.save(medicine);

        return medicineMapper.toResponse(savedMedicine);
    }

    // 2. Get all medicines with optional search and status filters.
    @Override
    @Transactional(readOnly = true)
    public List<MedicineResponse> getAllMedicines(
            String keyword,
            MedicineStatus status
    ) {

        String searchKeyword =
                (keyword == null || keyword.isBlank())
                        ? null
                        : keyword.trim();

        return medicineRepository
                .searchMedicines(searchKeyword, status)
                .stream()
                .map(medicineMapper::toResponse)
                .toList();
    }

    // 3. Get medicine by ID.
    @Override
    @Transactional(readOnly = true)
    public MedicineResponse getMedicineById(UUID medicineId) {

        Medicine medicine = findMedicineById(medicineId);

        return medicineMapper.toResponse(medicine);
    }

    // 4. Update medicine details.
    @Override
    public MedicineResponse updateMedicine(
            UUID medicineId,
            UpdateMedicineRequest request
    ) {

        Medicine medicine = findMedicineById(medicineId);

        validateDuplicateMedicine(
                request.name(),
                request.genericName(),
                request.strength(),
                request.dosageForm(),
                medicine.getId()
        );

        medicineMapper.updateEntity(medicine, request);

        Medicine updatedMedicine = medicineRepository.save(medicine);

        return medicineMapper.toResponse(updatedMedicine);
    }

    // 5. Activate or deactivate a medicine.
    @Override
    public MedicineResponse updateMedicineStatus(
            UUID medicineId,
            MedicineStatus status
    ) {

        if (status == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Medicine status is required"
            );
        }

        Medicine medicine = findMedicineById(medicineId);

        medicine.setStatus(status);

        Medicine updatedMedicine = medicineRepository.save(medicine);

        return medicineMapper.toResponse(updatedMedicine);
    }

    // Helper: Find medicine or throw exception.
    private Medicine findMedicineById(UUID medicineId) {

        return medicineRepository.findById(medicineId)
                .orElseThrow(() ->
                        new MedicineNotFoundException(
                                "Medicine not found with ID: " + medicineId
                        )
                );
    }

    // Helper: Prevent duplicate medicines during create and update.
    private void validateDuplicateMedicine(
            String name,
            String genericName,
            String strength,
            com.medicontinuum.backend.medicine.enums.DosageForm dosageForm,
            UUID excludedMedicineId
    ) {

        boolean alreadyExists;

        if (excludedMedicineId == null) {

            alreadyExists =
                    medicineRepository
                            .existsByNameIgnoreCaseAndGenericNameIgnoreCaseAndStrengthIgnoreCaseAndDosageForm(
                                    name.trim(),
                                    genericName.trim(),
                                    strength.trim(),
                                    dosageForm
                            );

        } else {

            alreadyExists =
                    medicineRepository
                            .existsByNameIgnoreCaseAndGenericNameIgnoreCaseAndStrengthIgnoreCaseAndDosageFormAndIdNot(
                                    name.trim(),
                                    genericName.trim(),
                                    strength.trim(),
                                    dosageForm,
                                    excludedMedicineId
                            );
        }

        if (alreadyExists) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "A medicine with the same name, generic name, strength and dosage form already exists"
            );
        }
    }
}