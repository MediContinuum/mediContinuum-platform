package com.medicontinuum.backend.inventory.service;

import java.util.List;
import java.util.UUID;

import com.medicontinuum.backend.inventory.dto.AddStockRequest;
import com.medicontinuum.backend.inventory.dto.ConsumeStockRequest;
import com.medicontinuum.backend.inventory.dto.InventoryResponse;
import com.medicontinuum.backend.inventory.dto.InventorySummaryResponse;
import com.medicontinuum.backend.inventory.dto.InventoryTransactionResponse;
import com.medicontinuum.backend.inventory.dto.UpdateStockThresholdRequest;

public interface InventoryService {

    InventoryResponse addStock(
        String currentUserEmail,
        AddStockRequest request
    );

    List<InventoryResponse> getMyInventory(
        String currentUserEmail
    );

    InventoryResponse getMyInventoryItem(
        String currentUserEmail,
        UUID inventoryItemId
    );

    List<InventoryResponse> getLowStock(
        String currentUserEmail
    );

    List<InventoryResponse> getExpiringStock(
        String currentUserEmail,
        int withinDays
    );

    InventoryResponse consumeStock(
        String currentUserEmail,
        UUID inventoryItemId,
        ConsumeStockRequest request
    );

    InventoryResponse updateStockThreshold(
        String currentUserEmail,
        UUID inventoryItemId,
        UpdateStockThresholdRequest request
    );

    List<InventoryTransactionResponse> getTransactions(
        String currentUserEmail,
        UUID inventoryItemId
    );

    List<InventoryResponse> getPatientInventory(
        UUID patientId
    );

    InventorySummaryResponse getMySummary(
        String currentUserEmail
    );

    int expireOldBatches();
}