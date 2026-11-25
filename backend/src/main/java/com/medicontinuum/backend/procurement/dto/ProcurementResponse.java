package com.medicontinuum.backend.procurement.dto;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import com.medicontinuum.backend.procurement.enums.ProcurementStatus;
public record ProcurementResponse(
    UUID id,String orderNumber,UUID organisationId,UUID vendorId,String vendorName,
    ProcurementStatus status,LocalDate expectedDeliveryDate,BigDecimal totalAmount,
    String notes,UUID createdByUserId,LocalDateTime createdAt,LocalDateTime updatedAt,
    List<Item> items
){
    public record Item(UUID id,UUID medicineId,String medicineName,String strength,
        BigDecimal orderedQuantity,BigDecimal receivedQuantity,String stockUnit,
        BigDecimal unitPrice,BigDecimal lineTotal){}
}
