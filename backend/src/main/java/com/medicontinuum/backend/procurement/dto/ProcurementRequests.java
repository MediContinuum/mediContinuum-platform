package com.medicontinuum.backend.procurement.dto;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import com.medicontinuum.backend.procurement.enums.ProcurementStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
public final class ProcurementRequests {
    private ProcurementRequests(){}
    public record Create(
        @NotNull UUID vendorId,
        @NotEmpty List<@Valid Item> items,
        LocalDate expectedDeliveryDate,
        @Size(max=1000) String notes
    ){}
    public record Item(
        @NotNull UUID medicineId,
        @NotNull @DecimalMin(value="0.001") BigDecimal quantity,
        @NotBlank @Size(max=40) String stockUnit,
        @NotNull @DecimalMin("0.00") BigDecimal unitPrice
    ){}
    public record UpdateStatus(@NotNull ProcurementStatus status){}
    public record Receive(
        @NotEmpty List<@Valid ReceivedItem> items,
        @Size(max=500) String notes
    ){}
    public record ReceivedItem(
        @NotNull UUID procurementItemId,
        @NotNull @DecimalMin(value="0.001") BigDecimal quantity,
        @Size(max=100) String batchNumber,
        @NotNull LocalDate expiryDate
    ){}
}
