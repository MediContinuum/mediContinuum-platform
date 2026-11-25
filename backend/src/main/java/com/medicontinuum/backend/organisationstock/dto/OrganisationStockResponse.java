package com.medicontinuum.backend.organisationstock.dto;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
public record OrganisationStockResponse(
    UUID id, UUID organisationId, UUID medicineId, String medicineName, String strength,
    String stockUnit, BigDecimal availableQuantity, BigDecimal lowStockThreshold,
    boolean lowStock, List<Batch> batches
){
    public record Batch(UUID id,String batchNumber,LocalDate expiryDate,BigDecimal quantityReceived,BigDecimal quantityRemaining){}
}
