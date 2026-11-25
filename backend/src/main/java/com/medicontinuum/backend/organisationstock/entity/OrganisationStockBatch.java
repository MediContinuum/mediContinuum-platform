package com.medicontinuum.backend.organisationstock.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="organisation_stock_batches",uniqueConstraints=@UniqueConstraint(name="uk_org_stock_batch_number",columnNames={"stock_item_id","batch_number"}),indexes={
    @Index(name="idx_org_stock_batch_item_expiry",columnList="stock_item_id,expiry_date"),
    @Index(name="idx_org_stock_batch_expiry",columnList="expiry_date")
})
@Getter @Setter @NoArgsConstructor
public class OrganisationStockBatch {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="stock_item_id",nullable=false) private OrganisationStock stockItem;
    @Column(name="batch_number",length=100) private String batchNumber;
    @Column(name="expiry_date",nullable=false) private LocalDate expiryDate;
    @Column(name="quantity_received",nullable=false,precision=14,scale=3) private BigDecimal quantityReceived;
    @Column(name="quantity_remaining",nullable=false,precision=14,scale=3) private BigDecimal quantityRemaining;
    @Column(name="received_at",nullable=false) private LocalDateTime receivedAt;
    @Column(name="created_at",nullable=false,updatable=false) private LocalDateTime createdAt;
    @PrePersist void onCreate(){LocalDateTime now=LocalDateTime.now();createdAt=now;if(receivedAt==null)receivedAt=now;}
}
