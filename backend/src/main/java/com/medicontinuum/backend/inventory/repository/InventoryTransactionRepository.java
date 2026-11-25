package com.medicontinuum.backend.inventory.repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import com.medicontinuum.backend.inventory.entity.InventoryTransaction;
import com.medicontinuum.backend.inventory.enums.InventoryTransactionType;
public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, UUID> {
    List<InventoryTransaction> findByInventoryItem_IdOrderByCreatedAtDesc(UUID inventoryItemId);
    List<InventoryTransaction> findByInventoryItem_Patient_IdAndTransactionTypeAndCreatedAtBetweenOrderByCreatedAtAsc(UUID patientId, InventoryTransactionType transactionType, LocalDateTime from, LocalDateTime to);
}
