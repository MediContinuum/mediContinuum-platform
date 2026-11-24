package com.medicontinuum.backend.inventory.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.medicontinuum.backend.inventory.dto.AddStockRequest;
import com.medicontinuum.backend.inventory.dto.ConsumeStockRequest;
import com.medicontinuum.backend.inventory.dto.InventoryResponse;
import com.medicontinuum.backend.inventory.dto.InventorySummaryResponse;
import com.medicontinuum.backend.inventory.dto.InventoryTransactionResponse;
import com.medicontinuum.backend.inventory.dto.UpdateStockThresholdRequest;
import com.medicontinuum.backend.inventory.service.InventoryService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@Validated
public class InventoryController {

    private final InventoryService inventoryService;

    // ---------------------------------------------------------
    // 1. Add medicine stock for logged-in patient
    // ---------------------------------------------------------

    @PostMapping("/me/batches")
    @PreAuthorize("hasAuthority('PATIENT')")
    public ResponseEntity<InventoryResponse> addStock(
        @Valid @RequestBody AddStockRequest request,
        Authentication authentication
    ) {

        InventoryResponse response = inventoryService.addStock(
            authentication.getName(),
            request
        );

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(response);
    }

    // ---------------------------------------------------------
    // 2. Get complete inventory of logged-in patient
    // ---------------------------------------------------------

    @GetMapping("/me")
    @PreAuthorize("hasAuthority('PATIENT')")
    public ResponseEntity<List<InventoryResponse>> getMyInventory(
        Authentication authentication
    ) {

        return ResponseEntity.ok(
            inventoryService.getMyInventory(
                authentication.getName()
            )
        );
    }

    // ---------------------------------------------------------
    // 3. Get inventory summary
    // ---------------------------------------------------------

    @GetMapping("/me/summary")
    @PreAuthorize("hasAuthority('PATIENT')")
    public ResponseEntity<InventorySummaryResponse> getMySummary(
        Authentication authentication
    ) {

        return ResponseEntity.ok(
            inventoryService.getMySummary(
                authentication.getName()
            )
        );
    }

    // ---------------------------------------------------------
    // 4. Get low-stock medicines
    // ---------------------------------------------------------

    @GetMapping("/me/low-stock")
    @PreAuthorize("hasAuthority('PATIENT')")
    public ResponseEntity<List<InventoryResponse>> getLowStock(
        Authentication authentication
    ) {

        return ResponseEntity.ok(
            inventoryService.getLowStock(
                authentication.getName()
            )
        );
    }

    // ---------------------------------------------------------
    // 5. Get medicines expiring soon
    // ---------------------------------------------------------

    @GetMapping("/me/expiring")
    @PreAuthorize("hasAuthority('PATIENT')")
    public ResponseEntity<List<InventoryResponse>> getExpiringStock(
        Authentication authentication,

        @RequestParam(defaultValue = "30")
        @Min(1)
        @Max(365)
        int withinDays
    ) {

        return ResponseEntity.ok(
            inventoryService.getExpiringStock(
                authentication.getName(),
                withinDays
            )
        );
    }

    // ---------------------------------------------------------
    // 6. Get one inventory item
    // ---------------------------------------------------------

    @GetMapping("/me/items/{inventoryItemId}")
    @PreAuthorize("hasAuthority('PATIENT')")
    public ResponseEntity<InventoryResponse> getMyInventoryItem(
        @PathVariable UUID inventoryItemId,
        Authentication authentication
    ) {

        return ResponseEntity.ok(
            inventoryService.getMyInventoryItem(
                authentication.getName(),
                inventoryItemId
            )
        );
    }

    // ---------------------------------------------------------
    // 7. Consume medicine stock
    // ---------------------------------------------------------

    @PostMapping("/me/items/{inventoryItemId}/consume")
    @PreAuthorize("hasAuthority('PATIENT')")
    public ResponseEntity<InventoryResponse> consumeStock(
        @PathVariable UUID inventoryItemId,

        @Valid @RequestBody
        ConsumeStockRequest request,

        Authentication authentication
    ) {

        return ResponseEntity.ok(
            inventoryService.consumeStock(
                authentication.getName(),
                inventoryItemId,
                request
            )
        );
    }

    // ---------------------------------------------------------
    // 8. Update low-stock threshold
    // ---------------------------------------------------------

    @PatchMapping("/me/items/{inventoryItemId}/threshold")
    @PreAuthorize("hasAuthority('PATIENT')")
    public ResponseEntity<InventoryResponse> updateThreshold(
        @PathVariable UUID inventoryItemId,

        @Valid @RequestBody
        UpdateStockThresholdRequest request,

        Authentication authentication
    ) {

        return ResponseEntity.ok(
            inventoryService.updateStockThreshold(
                authentication.getName(),
                inventoryItemId,
                request
            )
        );
    }

    // ---------------------------------------------------------
    // 9. Get inventory transaction history
    // ---------------------------------------------------------

    @GetMapping("/me/items/{inventoryItemId}/transactions")
    @PreAuthorize("hasAuthority('PATIENT')")
    public ResponseEntity<List<InventoryTransactionResponse>>
        getTransactions(
            @PathVariable UUID inventoryItemId,
            Authentication authentication
        ) {

        return ResponseEntity.ok(
            inventoryService.getTransactions(
                authentication.getName(),
                inventoryItemId
            )
        );
    }

    // ---------------------------------------------------------
    // 10. Admin views a patient's inventory
    // ---------------------------------------------------------

    @GetMapping("/patients/{patientId}")
    @PreAuthorize("hasAuthority('PLATFORM_ADMIN')")
    public ResponseEntity<List<InventoryResponse>> getPatientInventory(
        @PathVariable UUID patientId
    ) {

        return ResponseEntity.ok(
            inventoryService.getPatientInventory(patientId)
        );
    }
}