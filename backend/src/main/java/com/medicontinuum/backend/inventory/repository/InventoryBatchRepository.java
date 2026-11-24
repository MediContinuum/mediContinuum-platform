package com.medicontinuum.backend.inventory.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.medicontinuum.backend.inventory.entity.InventoryBatch;

import jakarta.persistence.LockModeType;

public interface InventoryBatchRepository
        extends JpaRepository<InventoryBatch, UUID> {

    List<InventoryBatch> findByInventoryItem_IdOrderByExpiryDateAsc(
        UUID inventoryItemId
    );

    boolean existsByInventoryItem_IdAndBatchNumber(
        UUID inventoryItemId,
        String batchNumber
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        SELECT b FROM InventoryBatch b
        WHERE b.inventoryItem.id = :inventoryItemId
          AND b.expiryDate >= :today
          AND b.quantityRemaining > 0
        ORDER BY b.expiryDate ASC, b.createdAt ASC
    """)
    List<InventoryBatch> findUsableBatchesForUpdate(
        @Param("inventoryItemId") UUID inventoryItemId,
        @Param("today") LocalDate today
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        SELECT b FROM InventoryBatch b
        WHERE b.expiryDate < :today
          AND b.quantityRemaining > 0
    """)
    List<InventoryBatch> findExpiredBatchesForUpdate(
        @Param("today") LocalDate today
    );

    List<InventoryBatch>
    findByInventoryItem_IdAndExpiryDateBetweenAndQuantityRemainingGreaterThanOrderByExpiryDateAsc(
        UUID inventoryItemId,
        LocalDate fromDate,
        LocalDate toDate,
        BigDecimal quantity
    );
}