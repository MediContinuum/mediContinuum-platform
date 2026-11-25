package com.medicontinuum.backend.procurement.entity;

import java.math.BigDecimal;
import java.util.UUID;
import com.medicontinuum.backend.medicine.entity.Medicine;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="procurement_order_items",indexes=@Index(name="idx_procurement_item_order",columnList="order_id"))
@Getter @Setter @NoArgsConstructor
public class ProcurementItem {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="order_id",nullable=false) private Procurement order;
    @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="medicine_id",nullable=false) private Medicine medicine;
    @Column(name="ordered_quantity",nullable=false,precision=14,scale=3) private BigDecimal orderedQuantity;
    @Column(name="received_quantity",nullable=false,precision=14,scale=3) private BigDecimal receivedQuantity=BigDecimal.ZERO;
    @Column(name="stock_unit",nullable=false,length=40) private String stockUnit;
    @Column(name="unit_price",nullable=false,precision=14,scale=2) private BigDecimal unitPrice=BigDecimal.ZERO;
    @Column(name="line_total",nullable=false,precision=14,scale=2) private BigDecimal lineTotal=BigDecimal.ZERO;
}
