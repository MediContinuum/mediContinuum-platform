package com.medicontinuum.backend.medicine.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.medicontinuum.backend.medicine.entity.Medicine;
import com.medicontinuum.backend.medicine.enums.DosageForm;
import com.medicontinuum.backend.medicine.enums.MedicineStatus;

public interface MedicineRepository
        extends JpaRepository<Medicine, UUID> {

    // Search medicines using keyword and optional status.
    @Query("""
            SELECT m FROM Medicine m
            WHERE (
                :keyword IS NULL OR
                LOWER(m.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                LOWER(m.genericName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                LOWER(m.brandName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                LOWER(m.manufacturer) LIKE LOWER(CONCAT('%', :keyword, '%'))
            )
            AND (:status IS NULL OR m.status = :status)
            ORDER BY m.name ASC, m.id ASC
            """)
    List<Medicine> searchMedicines(
            @Param("keyword") String keyword,
            @Param("status") MedicineStatus status
    );

    // Check duplicate medicine during creation.
    boolean existsByNameIgnoreCaseAndGenericNameIgnoreCaseAndStrengthIgnoreCaseAndDosageForm(
            String name,
            String genericName,
            String strength,
            DosageForm dosageForm
    );

    // Check duplicate medicine during update, excluding the current record.
    boolean existsByNameIgnoreCaseAndGenericNameIgnoreCaseAndStrengthIgnoreCaseAndDosageFormAndIdNot(
            String name,
            String genericName,
            String strength,
            DosageForm dosageForm,
            UUID medicineId
    );
}