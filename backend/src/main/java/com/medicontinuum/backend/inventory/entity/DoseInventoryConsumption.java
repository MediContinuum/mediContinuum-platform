package com.medicontinuum.backend.inventory.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import com.medicontinuum.backend.adherence.entity.DoseSchedule;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="dose_inventory_consumptions",uniqueConstraints=@UniqueConstraint(name="uk_dose_inventory_consumption_dose",columnNames="dose_schedule_id"),indexes=@Index(name="idx_dose_inventory_consumption_item",columnList="inventory_item_id"))
@Getter @Setter @NoArgsConstructor
public class DoseInventoryConsumption {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @OneToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="dose_schedule_id",nullable=false,unique=true) private DoseSchedule doseSchedule;
    @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="inventory_item_id",nullable=false) private InventoryItem inventoryItem;
    @Column(nullable=false,precision=12,scale=2) private BigDecimal quantity;
    @Column(nullable=false,length=40) private String unit;
    @Column(name="consumed_at",nullable=false,updatable=false) private LocalDateTime consumedAt;
    @PrePersist void onCreate(){consumedAt=LocalDateTime.now();}
}
