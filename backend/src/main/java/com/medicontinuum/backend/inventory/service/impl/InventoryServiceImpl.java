package com.medicontinuum.backend.inventory.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.medicontinuum.backend.inventory.dto.AddStockRequest;
import com.medicontinuum.backend.inventory.dto.ConsumeStockRequest;
import com.medicontinuum.backend.inventory.dto.InventoryBatchResponse;
import com.medicontinuum.backend.inventory.dto.InventoryResponse;
import com.medicontinuum.backend.inventory.dto.InventorySummaryResponse;
import com.medicontinuum.backend.inventory.dto.InventoryTransactionResponse;
import com.medicontinuum.backend.inventory.dto.UpdateStockThresholdRequest;
import com.medicontinuum.backend.inventory.entity.InventoryBatch;
import com.medicontinuum.backend.inventory.entity.InventoryItem;
import com.medicontinuum.backend.inventory.entity.InventoryTransaction;
import com.medicontinuum.backend.inventory.entity.DoseInventoryConsumption;
import com.medicontinuum.backend.inventory.repository.DoseInventoryConsumptionRepository;
import com.medicontinuum.backend.adherence.entity.DoseSchedule;
import com.medicontinuum.backend.adherence.enums.DoseStatus;
import com.medicontinuum.backend.adherence.repository.DoseScheduleRepository;
import com.medicontinuum.backend.prescription.entity.PrescriptionItem;
import com.medicontinuum.backend.inventory.enums.InventoryTransactionType;
import com.medicontinuum.backend.inventory.repository.InventoryBatchRepository;
import com.medicontinuum.backend.inventory.repository.InventoryItemRepository;
import com.medicontinuum.backend.inventory.repository.InventoryTransactionRepository;
import com.medicontinuum.backend.inventory.service.InventoryService;
import com.medicontinuum.backend.medicine.entity.Medicine;
import com.medicontinuum.backend.medicine.enums.MedicineStatus;
import com.medicontinuum.backend.medicine.repository.MedicineRepository;
import com.medicontinuum.backend.patient.entity.Patient;
import com.medicontinuum.backend.patient.repository.PatientRepository;
import com.medicontinuum.backend.user.entity.User;
import com.medicontinuum.backend.user.repository.UserRepository;
import com.medicontinuum.backend.notification.service.NotificationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class InventoryServiceImpl implements InventoryService {

    private final InventoryItemRepository inventoryItemRepository;
    private final InventoryBatchRepository inventoryBatchRepository;
    private final InventoryTransactionRepository inventoryTransactionRepository;
    private final DoseInventoryConsumptionRepository doseInventoryConsumptionRepository;
    private final DoseScheduleRepository doseScheduleRepository;

    private final PatientRepository patientRepository;
    private final MedicineRepository medicineRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Value("${app.time-zone:Asia/Kolkata}")
    private String appTimeZone;

    // ---------------------------------------------------------
    // 1. Add a new medicine batch
    // ---------------------------------------------------------

    @Override
    public InventoryResponse addStock(
        String currentUserEmail,
        AddStockRequest request
    ) {

        Patient patient = findPatientByEmail(currentUserEmail);
        User currentUser = findUserByEmail(currentUserEmail);

        Medicine medicine = medicineRepository
            .findById(request.medicineId())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Medicine not found"
            ));

        if (medicine.getStatus() != MedicineStatus.ACTIVE) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Cannot add stock for an inactive medicine"
            );
        }

        String stockUnit = normalizeUnit(request.stockUnit());

        InventoryItem inventoryItem =
            inventoryItemRepository
                .findByPatient_IdAndMedicine_Id(
                    patient.getId(),
                    medicine.getId()
                )
                .orElse(null);

        if (inventoryItem == null) {

            inventoryItem = InventoryItem.builder()
                .patient(patient)
                .medicine(medicine)
                .stockUnit(stockUnit)
                .lowStockThreshold(
                    request.lowStockThreshold() == null
                        ? BigDecimal.ZERO
                        : request.lowStockThreshold()
                )
                .build();

            inventoryItem = inventoryItemRepository.saveAndFlush(
                inventoryItem
            );

        } else {

            inventoryItem = inventoryItemRepository
                .findByIdForUpdate(inventoryItem.getId())
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Inventory record not found"
                ));

            if (!inventoryItem.getStockUnit().equalsIgnoreCase(stockUnit)) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Stock unit does not match the existing inventory unit"
                );
            }

            if (request.lowStockThreshold() != null) {
                inventoryItem.setLowStockThreshold(
                    request.lowStockThreshold()
                );
            }
        }

        if (request.batchNumber() != null &&
            !request.batchNumber().isBlank() &&
            inventoryBatchRepository
                .existsByInventoryItem_IdAndBatchNumber(
                    inventoryItem.getId(),
                    request.batchNumber().trim()
                )) {

            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "This batch number is already registered for this medicine"
            );
        }

        InventoryBatch batch = InventoryBatch.builder()
            .inventoryItem(inventoryItem)
            .batchNumber(trimToNull(request.batchNumber()))
            .expiryDate(request.expiryDate())
            .quantityReceived(request.quantity())
            .quantityRemaining(request.quantity())
            .build();

        InventoryBatch savedBatch =
            inventoryBatchRepository.save(batch);

        InventoryTransaction transaction =
            InventoryTransaction.builder()
                .inventoryItem(inventoryItem)
                .inventoryBatch(savedBatch)
                .performedBy(currentUser)
                .transactionType(InventoryTransactionType.RECEIVED)
                .quantity(request.quantity())
                .notes(trimToNull(request.notes()))
                .build();

        inventoryTransactionRepository.save(transaction);

        InventoryResponse response = toInventoryResponse(inventoryItem);
        notifyIfLowStock(inventoryItem, response);
        return response;
    }

    // ---------------------------------------------------------
    // 2. Get complete inventory for logged-in patient
    // ---------------------------------------------------------

    @Override
    @Transactional(readOnly = true)
    public List<InventoryResponse> getMyInventory(
        String currentUserEmail
    ) {

        Patient patient = findPatientByEmail(currentUserEmail);

        return inventoryItemRepository
            .findByPatient_Id(patient.getId())
            .stream()
            .map(this::toInventoryResponse)
            .toList();
    }

    // ---------------------------------------------------------
    // 3. Get one inventory record
    // ---------------------------------------------------------

    @Override
    @Transactional(readOnly = true)
    public InventoryResponse getMyInventoryItem(
        String currentUserEmail,
        UUID inventoryItemId
    ) {

        InventoryItem item = findOwnedInventoryItem(
            currentUserEmail,
            inventoryItemId
        );

        return toInventoryResponse(item);
    }

    // ---------------------------------------------------------
    // 4. Get low-stock medicines
    // ---------------------------------------------------------

    @Override
    @Transactional(readOnly = true)
    public List<InventoryResponse> getLowStock(
        String currentUserEmail
    ) {

        Patient patient = findPatientByEmail(currentUserEmail);

        return inventoryItemRepository
            .findByPatient_Id(patient.getId())
            .stream()
            .map(this::toInventoryResponse)
            .filter(InventoryResponse::lowStock)
            .toList();
    }

    // ---------------------------------------------------------
    // 5. Get medicines expiring within specified days
    // ---------------------------------------------------------

    @Override
    @Transactional(readOnly = true)
    public List<InventoryResponse> getExpiringStock(
        String currentUserEmail,
        int withinDays
    ) {

        if (withinDays < 1 || withinDays > 365) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "withinDays must be between 1 and 365"
            );
        }

        Patient patient = findPatientByEmail(currentUserEmail);

        LocalDate today = today();
        LocalDate expiryLimit = today.plusDays(withinDays);

        return inventoryItemRepository
            .findByPatient_Id(patient.getId())
            .stream()
            .map(this::toInventoryResponse)
            .filter(item -> item.batches().stream().anyMatch(batch ->
                !batch.expiryDate().isBefore(today) &&
                !batch.expiryDate().isAfter(expiryLimit) &&
                batch.quantityRemaining().compareTo(BigDecimal.ZERO) > 0
            ))
            .toList();
    }

    // ---------------------------------------------------------
    // 6. Consume stock using FEFO
    // ---------------------------------------------------------

    @Override
    public InventoryResponse consumeStock(
        String currentUserEmail,
        UUID inventoryItemId,
        ConsumeStockRequest request
    ) {

        User currentUser = findUserByEmail(currentUserEmail);

        InventoryItem item = findOwnedInventoryItemForUpdate(
            currentUserEmail,
            inventoryItemId
        );

        String requestedUnit = normalizeUnit(request.stockUnit());

        if (!item.getStockUnit().equalsIgnoreCase(requestedUnit)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Consumption unit does not match inventory stock unit"
            );
        }

        LocalDate today = today();

        List<InventoryBatch> batches =
            inventoryBatchRepository.findUsableBatchesForUpdate(
                item.getId(),
                today
            );

        BigDecimal available = batches.stream()
            .map(InventoryBatch::getQuantityRemaining)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (available.compareTo(request.quantity()) < 0) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Insufficient usable stock. Available: "
                    + available + " " + item.getStockUnit()
            );
        }

        BigDecimal remainingToConsume = request.quantity();

        for (InventoryBatch batch : batches) {

            if (remainingToConsume.compareTo(BigDecimal.ZERO) <= 0) {
                break;
            }

            BigDecimal batchQuantity = batch.getQuantityRemaining();

            BigDecimal quantityToConsume =
                batchQuantity.min(remainingToConsume);

            batch.setQuantityRemaining(
                batchQuantity.subtract(quantityToConsume)
            );

            InventoryTransaction transaction =
                InventoryTransaction.builder()
                    .inventoryItem(item)
                    .inventoryBatch(batch)
                    .performedBy(currentUser)
                    .transactionType(
                        InventoryTransactionType.CONSUMED
                    )
                    .quantity(quantityToConsume)
                    .notes(trimToNull(request.notes()))
                    .build();

            inventoryTransactionRepository.save(transaction);

            remainingToConsume =
                remainingToConsume.subtract(quantityToConsume);
        }

        inventoryBatchRepository.flush();

        InventoryResponse response = toInventoryResponse(item);
        notifyIfLowStock(item, response);
        return response;
    }

    // Deduct the prescribed amount only once when the patient confirms a dose.
    // The locked dose row and unique consumption row prevent duplicate deductions on retries.
    @Override
    public void consumeDoseForSchedule(String currentUserEmail, UUID doseScheduleId) {
        DoseSchedule schedule = doseScheduleRepository.findByIdForUpdate(doseScheduleId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Dose schedule not found"
            ));

        if (schedule.getStatus() != DoseStatus.TAKEN) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT, "Only a TAKEN dose can consume inventory"
            );
        }
        if (doseInventoryConsumptionRepository.existsByDoseSchedule_Id(doseScheduleId)) {
            return;
        }

        User currentUser = findUserByEmail(currentUserEmail);
        Patient patient = schedule.getPrescriptionItem().getPrescription().getPatient();
        if (!patient.getUser().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, "You cannot consume another patient's inventory"
            );
        }

        PrescriptionItem prescriptionItem = schedule.getPrescriptionItem();
        InventoryItem inventoryItem = inventoryItemRepository
            .findByPatient_IdAndMedicine_Id(patient.getId(), prescriptionItem.getMedicine().getId())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.CONFLICT, "No patient inventory exists for this prescribed medicine"
            ));

        String prescribedUnit = normalizeUnit(prescriptionItem.getDosageUnit());
        String stockUnit = normalizeUnit(inventoryItem.getStockUnit());
        if (!prescribedUnit.equals(stockUnit)) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Cannot safely deduct this dose: prescription unit '" + prescriptionItem.getDosageUnit()
                    + "' does not match inventory unit '" + inventoryItem.getStockUnit() + "'"
            );
        }

        BigDecimal quantity = prescriptionItem.getDosageAmount();
        if (quantity == null || quantity.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Prescription dose quantity is invalid");
        }

        consumeStock(
            currentUserEmail,
            inventoryItem.getId(),
            new ConsumeStockRequest(
                quantity,
                inventoryItem.getStockUnit(),
                "Automatic deduction for confirmed dose " + doseScheduleId
            )
        );

        DoseInventoryConsumption consumption = new DoseInventoryConsumption();
        consumption.setDoseSchedule(schedule);
        consumption.setInventoryItem(inventoryItem);
        consumption.setQuantity(quantity);
        consumption.setUnit(inventoryItem.getStockUnit());
        doseInventoryConsumptionRepository.save(consumption);
    }

    // ---------------------------------------------------------
    // 7. Update low-stock threshold
    // ---------------------------------------------------------

    @Override
    public InventoryResponse updateStockThreshold(
        String currentUserEmail,
        UUID inventoryItemId,
        UpdateStockThresholdRequest request
    ) {

        InventoryItem item = findOwnedInventoryItemForUpdate(
            currentUserEmail,
            inventoryItemId
        );

        item.setLowStockThreshold(request.lowStockThreshold());

        InventoryItem updated = inventoryItemRepository.save(item);

        InventoryResponse response = toInventoryResponse(updated);
        notifyIfLowStock(updated, response);
        return response;
    }

    // ---------------------------------------------------------
    // 8. Get transaction history
    // ---------------------------------------------------------

    @Override
    @Transactional(readOnly = true)
    public List<InventoryTransactionResponse> getTransactions(
        String currentUserEmail,
        UUID inventoryItemId
    ) {

        InventoryItem item = findOwnedInventoryItem(
            currentUserEmail,
            inventoryItemId
        );

        return inventoryTransactionRepository
            .findByInventoryItem_IdOrderByCreatedAtDesc(item.getId())
            .stream()
            .map(this::toTransactionResponse)
            .toList();
    }

    // ---------------------------------------------------------
    // 9. Platform admin views a patient's inventory
    // ---------------------------------------------------------

    @Override
    @Transactional(readOnly = true)
    public List<InventoryResponse> getPatientInventory(
        UUID patientId
    ) {

        if (!patientRepository.existsById(patientId)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Patient not found"
            );
        }

        return inventoryItemRepository
            .findByPatient_Id(patientId)
            .stream()
            .map(this::toInventoryResponse)
            .toList();
    }

    // ---------------------------------------------------------
    // 10. Get inventory summary
    // ---------------------------------------------------------

    @Override
    @Transactional(readOnly = true)
    public InventorySummaryResponse getMySummary(
        String currentUserEmail
    ) {

        List<InventoryResponse> inventory =
            getMyInventory(currentUserEmail);

        long totalMedicineTypes = inventory.size();

        long lowStockCount = inventory.stream()
            .filter(InventoryResponse::lowStock)
            .count();

        java.util.Map<String, BigDecimal> quantityByUnit = inventory.stream()
            .collect(java.util.stream.Collectors.groupingBy(
                item -> item.stockUnit().trim().toUpperCase(java.util.Locale.ROOT),
                java.util.TreeMap::new,
                java.util.stream.Collectors.reducing(
                    BigDecimal.ZERO,
                    InventoryResponse::availableQuantity,
                    BigDecimal::add
                )
            ));

        // A single scalar total is meaningful only when all items use the same unit.
        BigDecimal totalAvailable = quantityByUnit.size() == 1
            ? quantityByUnit.values().iterator().next()
            : null;

        long expiringBatchCount = inventory.stream()
            .flatMap(item -> item.batches().stream())
            .filter(batch ->
                batch.quantityRemaining().compareTo(BigDecimal.ZERO) > 0 &&
                !batch.expiryDate().isBefore(today()) &&
                !batch.expiryDate().isAfter(today().plusDays(30))
            )
            .count();

        return new InventorySummaryResponse(
            totalMedicineTypes,
            lowStockCount,
            totalAvailable,
            expiringBatchCount,
            quantityByUnit
        );
    }

    // ---------------------------------------------------------
    // 11. Mark expired batches and record expiry transactions
    // ---------------------------------------------------------

    @Override
    public int expireOldBatches() {

        List<InventoryBatch> expiredBatches =
            inventoryBatchRepository.findExpiredBatchesForUpdate(
                today()
            );

        int expiredCount = 0;

        for (InventoryBatch batch : expiredBatches) {

            BigDecimal expiredQuantity =
                batch.getQuantityRemaining();

            if (expiredQuantity.compareTo(BigDecimal.ZERO) <= 0) {
                continue;
            }

            batch.setQuantityRemaining(BigDecimal.ZERO);

            InventoryTransaction transaction =
                InventoryTransaction.builder()
                    .inventoryItem(batch.getInventoryItem())
                    .inventoryBatch(batch)
                    .performedBy(null)
                    .transactionType(
                        InventoryTransactionType.EXPIRED
                    )
                    .quantity(expiredQuantity)
                    .notes("Automatically expired by system")
                    .build();

            inventoryTransactionRepository.save(transaction);

            expiredCount++;
        }

        inventoryBatchRepository.flush();

        return expiredCount;
    }

    // ---------------------------------------------------------
    // 12. Notify patients about batches approaching expiry
    // ---------------------------------------------------------

    @Override
    public int notifyExpiringBatches(int withinDays) {

        if (withinDays < 1 || withinDays > 365) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Expiry warning window must be between 1 and 365 days"
            );
        }

        LocalDate today = today();
        LocalDate expiryLimit = today.plusDays(withinDays);

        List<InventoryBatch> expiringBatches =
            inventoryBatchRepository
                .findByExpiryDateBetweenAndQuantityRemainingGreaterThanOrderByExpiryDateAsc(
                    today,
                    expiryLimit,
                    BigDecimal.ZERO
                );

        for (InventoryBatch batch : expiringBatches) {

            InventoryItem item = batch.getInventoryItem();

            notificationService.notifyExpiryWarning(
                item.getPatient().getUser().getEmail(),
                batch.getId(),
                item.getMedicine().getName(),
                batch.getExpiryDate(),
                batch.getQuantityRemaining(),
                item.getStockUnit()
            );
        }

        return expiringBatches.size();
    }

    private void notifyIfLowStock(
        InventoryItem item,
        InventoryResponse response
    ) {

        if (!response.lowStock()) {
            return;
        }

        notificationService.notifyLowStock(
            item.getPatient().getUser().getEmail(),
            item.getId(),
            item.getMedicine().getName(),
            response.availableQuantity(),
            item.getStockUnit()
        );
    }

    // =========================================================
    // Helper methods
    // =========================================================

    private Patient findPatientByEmail(String email) {

        User user = findUserByEmail(email);

        return patientRepository.findByUser_Id(user.getId())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Patient profile not found for this user"
            ));
    }

    private User findUserByEmail(String email) {

        return userRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "User not found"
            ));
    }

    private InventoryItem findOwnedInventoryItem(
        String email,
        UUID inventoryItemId
    ) {

        Patient patient = findPatientByEmail(email);

        InventoryItem item = inventoryItemRepository
            .findById(inventoryItemId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Inventory item not found"
            ));

        if (!item.getPatient().getId().equals(patient.getId())) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "You cannot access another patient's inventory"
            );
        }

        return item;
    }

    private InventoryItem findOwnedInventoryItemForUpdate(
        String email,
        UUID inventoryItemId
    ) {

        Patient patient = findPatientByEmail(email);

        InventoryItem item = inventoryItemRepository
            .findByIdForUpdate(inventoryItemId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Inventory item not found"
            ));

        if (!item.getPatient().getId().equals(patient.getId())) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "You cannot modify another patient's inventory"
            );
        }

        return item;
    }

    private InventoryResponse toInventoryResponse(
        InventoryItem item
    ) {

        LocalDate today = today();

        List<InventoryBatch> batches =
            inventoryBatchRepository
                .findByInventoryItem_IdOrderByExpiryDateAsc(item.getId());

        BigDecimal availableQuantity = BigDecimal.ZERO;
        BigDecimal expiredQuantity = BigDecimal.ZERO;

        List<InventoryBatchResponse> batchResponses =
            new ArrayList<>();

        for (InventoryBatch batch : batches) {

            boolean expired = batch.getExpiryDate().isBefore(today);

            if (expired) {
                expiredQuantity =
                    expiredQuantity.add(batch.getQuantityRemaining());
            } else {
                availableQuantity =
                    availableQuantity.add(batch.getQuantityRemaining());
            }

            String batchStatus;

            if (expired) {
                batchStatus = "EXPIRED";
            } else if (batch.getQuantityRemaining()
                    .compareTo(BigDecimal.ZERO) == 0) {
                batchStatus = "OUT_OF_STOCK";
            } else {
                batchStatus = "ACTIVE";
            }

            batchResponses.add(new InventoryBatchResponse(
                batch.getId(),
                batch.getBatchNumber(),
                batch.getExpiryDate(),
                batch.getQuantityReceived(),
                batch.getQuantityRemaining(),
                batchStatus,
                batch.getReceivedAt()
            ));
        }

        boolean lowStock = availableQuantity.compareTo(
            item.getLowStockThreshold()
        ) <= 0;

        Medicine medicine = item.getMedicine();

        return new InventoryResponse(
            item.getId(),
            item.getPatient().getId(),
            medicine.getId(),
            medicine.getName(),
            medicine.getGenericName(),
            medicine.getStrength(),
            medicine.getDosageForm().name(),
            item.getStockUnit(),
            availableQuantity,
            expiredQuantity,
            item.getLowStockThreshold(),
            lowStock,
            item.getUpdatedAt(),
            batchResponses
        );
    }

    private InventoryTransactionResponse toTransactionResponse(
        InventoryTransaction transaction
    ) {

        return new InventoryTransactionResponse(
            transaction.getId(),
            transaction.getInventoryItem().getId(),
            transaction.getInventoryBatch().getId(),
            transaction.getInventoryBatch().getBatchNumber(),
            transaction.getTransactionType(),
            transaction.getQuantity(),
            transaction.getNotes(),
            transaction.getPerformedBy() == null
                ? "SYSTEM"
                : transaction.getPerformedBy().getFullName(),
            transaction.getCreatedAt()
        );
    }

    private LocalDate today() {
        return LocalDate.now(ZoneId.of(appTimeZone));
    }

    private String normalizeUnit(String value) {
        String unit = value.trim().toUpperCase(java.util.Locale.ROOT);
        return switch (unit) {
            case "TABLETS", "TAB", "TABS" -> "TABLET";
            case "CAPSULES", "CAP", "CAPS" -> "CAPSULE";
            case "MILLILITER", "MILLILITERS", "MILLILITRE", "MILLILITRES" -> "ML";
            case "MILLIGRAM", "MILLIGRAMS" -> "MG";
            case "MICROGRAM", "MICROGRAMS" -> "MCG";
            case "DROPS" -> "DROP";
            default -> unit;
        };
    }

    private String trimToNull(String value) {

        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }
}