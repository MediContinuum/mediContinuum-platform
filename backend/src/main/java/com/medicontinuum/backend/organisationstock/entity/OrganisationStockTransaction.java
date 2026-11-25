package com.medicontinuum.backend.organisationstock.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import com.medicontinuum.backend.organisationstock.enums.OrganisationStockTransactionType;
import com.medicontinuum.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="organisation_stock_transactions",indexes={
    @Index(name="idx_org_stock_tx_item_date",columnList="stock_item_id,created_at"),
    @Index(name="idx_org_stock_tx_batch",columnList="batch_id")
})
@Getter @Setter @NoArgsConstructor
public class OrganisationStockTransaction {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="stock_item_id",nullable=false) private OrganisationStock stockItem;
    @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="batch_id",nullable=false) private OrganisationStockBatch batch;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="performed_by_user_id") private User performedBy;
    @Enumerated(EnumType.STRING) @Column(name="transaction_type",nullable=false,length=30) private OrganisationStockTransactionType type;
    @Column(nullable=false,precision=14,scale=3) private BigDecimal quantity;
    @Column(length=500) private String notes;
    @Column(name="created_at",nullable=false,updatable=false) private LocalDateTime createdAt;
    @PrePersist void onCreate(){createdAt=LocalDateTime.now();}
}
