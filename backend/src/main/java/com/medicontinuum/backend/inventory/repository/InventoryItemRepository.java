package com.medicontinuum.backend.inventory.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.medicontinuum.backend.inventory.entity.InventoryItem;

import jakarta.persistence.LockModeType;

public interface InventoryItemRepository
        extends JpaRepository<InventoryItem, UUID> {

    Optional<InventoryItem> findByPatient_IdAndMedicine_Id(
        UUID patientId,
        UUID medicineId
    );

    List<InventoryItem> findByPatient_Id(UUID patientId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        SELECT i FROM InventoryItem i
        WHERE i.id = :inventoryItemId
    """)
    Optional<InventoryItem> findByIdForUpdate(
        @Param("inventoryItemId") UUID inventoryItemId
    );
}