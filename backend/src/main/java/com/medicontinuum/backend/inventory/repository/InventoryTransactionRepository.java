package com.medicontinuum.backend.inventory.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medicontinuum.backend.inventory.entity.InventoryTransaction;

public interface InventoryTransactionRepository
        extends JpaRepository<InventoryTransaction, UUID> {

    List<InventoryTransaction>
    findByInventoryItem_IdOrderByCreatedAtDesc(
        UUID inventoryItemId
    );
}